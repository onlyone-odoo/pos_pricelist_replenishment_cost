{
    "name": "POS Pricelist Replenishment Cost Extension",
    "summary": """
        Extiende las listas de precios con costo de reposición para su uso en el Punto de Venta (POS).""",
    "author": "Be OnlyOne",
    "maintainers": ["onlyone-odoo"],
    "website": "https://onlyone.odoo.com/",
    "license": "AGPL-3",
    "category": "Point Of Sale",
    "version": "17.0.1.0.0",
    "development_status": "Production/Stable",
    "application": False,
    "installable": True,
    "external_dependencies": {
        "python": [],
        "bin": [],
    },
    "depends": ["pricelist_replenishment_cost", "point_of_sale"],
    "data": [],
    "assets": {
        "point_of_sale.assets": [
            "pos_pricelist_replenishment_cost/static/src/js/pos_pricelist_extension.js",
        ],
    },
}
