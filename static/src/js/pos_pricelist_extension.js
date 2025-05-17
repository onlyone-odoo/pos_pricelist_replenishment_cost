odoo.define('pos_pricelist_replenishment_cost.pos_pricelist_extension', function (require) {
    "use strict";

    var models = require('point_of_sale.models');
    var luxon = require('luxon');

    var _super_pos_model = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
        initialize: function () {
            _super_pos_model.initialize.apply(this, arguments);
            console.log('PosModel initialized with pricelists:', this.pricelists);
        },

        get_price: function (product, pricelist, quantity, price_extra = 0, recurring = false) {
            var self = this;
            console.log('get_price called for product:', product.display_name, 'with pricelist:', pricelist ? pricelist.name : 'none');
            console.log('Quantity:', quantity, 'Price Extra:', price_extra, 'Recurring:', recurring);

            var price = (product.list_price || product.price || 0) + (price_extra || 0);
            console.log('Initial price (list_price + price_extra):', price);

            if (!pricelist) {
                console.log('No pricelist provided, returning price:', price);
                return price;
            }

            var date = luxon.DateTime.now();
            var applicable_rules = pricelist.items.filter(function (item) {
                var min_quantity = item.min_quantity || 0;
                var date_start = item.date_start ? luxon.DateTime.fromISO(item.date_start) : null;
                var date_end = item.date_end ? luxon.DateTime.fromISO(item.date_end) : null;
                var now = luxon.DateTime.local();

                var categories = product.parent_category_ids.concat(product.categ.id);
                var is_category_valid = !item.categ_id || categories.includes(item.categ_id[0]);

                var is_applicable = (
                    is_category_valid &&
                    (!min_quantity || quantity >= min_quantity) &&
                    (!date_start || now >= date_start) &&
                    (!date_end || now <= date_end) &&
                    (
                        item.applied_on === '3_global' ||
                        (item.applied_on === '2_product_category' && product.categ_id && product.categ_id[0] === item.categ_id[0]) ||
                        (item.applied_on === '1_product' && product.product_tmpl_id && product.product_tmpl_id[0] === item.product_tmpl_id[0]) ||
                        (item.applied_on === '0_product_variant' && product.id === item.product_id[0])
                    )
                );
                return is_applicable;
            });

            console.log('Applicable rules for pricelist', pricelist.name, ':', applicable_rules);

            var rule = applicable_rules.find(function (rule) {
                return !rule.min_quantity || quantity >= rule.min_quantity;
            });

            if (!rule) {
                console.log('No applicable rule found, returning price:', price);
                return price;
            }

            console.log('Selected rule:', rule);

            if (rule.compute_price === 'fixed') {
                price = rule.fixed_price || price;
                console.log('Compute price: fixed, new price:', price);
            } else if (rule.compute_price === 'percentage') {
                var base_price = self.get_base_price(product, rule);
                price = base_price * (1 - (rule.percent_price || 0) / 100);
                console.log('Compute price: percentage, base_price:', base_price, 'percent_price:', rule.percent_price, 'new price:', price);
            } else if (rule.compute_price === 'formula') {
                var base_price = self.get_base_price(product, rule);
                var discount = rule.price_discount || 0;
                if (rule.base === 'standard_price') {
                    discount = -(rule.price_markup || 0);
                }
                price = base_price * (1 - discount / 100);
                console.log('Compute price: formula, base_price:', base_price, 'discount:', discount, 'price after discount:', price);
                if (rule.price_round) {
                    price = Math.round(price / rule.price_round) * rule.price_round;
                    console.log('Applied price_round:', rule.price_round, 'new price:', price);
                }
                if (rule.price_surcharge) {
                    price += rule.price_surcharge;
                    console.log('Applied price_surcharge:', rule.price_surcharge, 'new price:', price);
                }
                if (rule.price_min_margin) {
                    price = Math.max(price, base_price + (rule.price_min_margin || 0));
                    console.log('Applied price_min_margin:', rule.price_min_margin, 'new price:', price);
                }
                if (rule.price_max_margin) {
                    price = Math.min(price, base_price + (rule.price_max_margin || 0));
                    console.log('Applied price_max_margin:', rule.price_max_margin, 'new price:', price);
                }
            }

            console.log('Final price calculated:', price);
            return price;
        },

        get_base_price: function (product, rule) {
            var self = this;
            console.log('get_base_price called with rule.base:', rule.base);
            if (rule.base === 'replenishment_cost') {
                var base_price = product.replenishment_cost !== undefined ? product.replenishment_cost : (product.list_price || product.price || 0);
                console.log('Using replenishment_cost, base_price:', base_price, 'replenishment_cost:', product.replenishment_cost);
                return base_price;
            } else if (rule.base === 'pricelist' && rule.base_pricelist_id) {
                var base_pricelist = self.pricelists.find(function (pl) {
                    return pl.id === rule.base_pricelist_id[0];
                });
                if (base_pricelist) {
                    console.log('Using base pricelist:', base_pricelist.name);
                    return self.get_price(product, base_pricelist, 1);
                } else if (self.recurring) {
                    console.log('Error: Base pricelist not found for ID:', rule.base_pricelist_id[0]);
                    alert(
                        _t(
                            "An error occurred when loading product prices. " +
                            "Make sure all pricelists are available in the POS."
                        )
                    );
                }
            } else if (rule.base === 'standard_price') {
                console.log('Using standard_price, base_price:', product.standard_price);
                return product.standard_price || 0;
            }
            console.log('Using list_price, base_price:', product.list_price || product.price || 0);
            return product.list_price || product.price || 0;
        }
    });

    return models;
});