from odoo import models


class PosSession(models.Model):
    _inherit = 'pos.session'

    def _loader_params_product_product(self):
        result = super()._loader_params_product_product()
        result['search_params']['fields'].append('replenishment_cost')
        return result

    def _loader_params_product_pricelist(self):
        result = super()._loader_params_product_pricelist()
        result['search_params']['fields'].append('base')
        return result