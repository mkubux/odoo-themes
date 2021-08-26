# -*- coding: utf-8 -*-
{
    'name': "theme_loengo",

    'summary': """ Loengo theme with three color,
        """,

    'description': """
        loengo theme
    """,

    'author': "Daniel AC",
    'website': "https://github.com/danieluac",
    'category': 'Theme/Loengo',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base', 'website'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',

        'views/assets.xml',
        'views/layout.xml',
        'views/views.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
}
