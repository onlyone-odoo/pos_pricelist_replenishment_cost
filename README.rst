===========
POS Pricelist Replenishment Cost Extension
===========

.. |badge1| image:: https://img.shields.io/badge/maturity-Stable-brightgreen
    :target: https://odoo-community.org/page/development-status
    :alt: Stable
.. |badge2| image:: https://img.shields.io/badge/licence-AGPL--3-blue.png
    :target: http://www.gnu.org/licenses/agpl-3.0-standalone.html
    :alt: License: AGPL-3
.. |badge3| image:: https://onlyone.odoo.com/web/image/website/1/logo/OnlyOne%20Soft?unique=dccda5b
    :target: https://onlyone.odoo.com/
    :alt: Be OnlyOne

|badge1| |badge2| |badge3|

This module extends the `pricelist_replenishment_cost` module to support replenishment cost-based pricelist rules in the Point of Sale (POS) module of Odoo. It ensures that POS sessions correctly apply pricelist rules using the product's replenishment cost as a base price.

**Table of contents**

.. contents::
   :local:

Usage
=====

1. Ensure the `pricelist_replenishment_cost` module is installed.
2. Go to *Point of Sale > Configuration > Point of Sale* and select or create a POS configuration.
3. Assign a pricelist that includes a rule with "Based on" set to "Replenishment Cost".
4. Open a POS session (*Point of Sale > Dashboard > New Session*).
5. Add a product with a replenishment cost-based pricelist rule to the order.
6. Verify that the price reflects the replenishment cost, adjusted by the pricelist rule (e.g., fixed price, discount, or formula).

Known issues / Roadmap
======================

* No known issues at this time.
* Roadmap:
  - Optimize performance for large product catalogs with replenishment cost rules.
  - Add support for dynamic currency conversion in POS for replenishment cost.

Bug Tracker
===========

* Help Contact

Credits
=======

Authors
~~~~~~~

* Be OnlyOne

Contributors
~~~~~~~~~~~~

* `Be OnlyOne. <https://onlyone.odoo.com/>`_
  
  * Matías Bressanello

Maintainers
~~~~~~~~~~~

This module is maintained by Be OnlyOne