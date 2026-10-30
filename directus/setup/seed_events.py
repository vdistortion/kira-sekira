#!/usr/bin/env python3
"""Initialize approved events copy once; preserve all later CMS edits."""
import json
import sys
import urllib.error
from pathlib import Path
from seed_core import login, req

def main():
    token=login()
    if '--ensure-field' in sys.argv:
        try:
            req('GET', '/fields/main_site/events_content', token)
        except urllib.error.HTTPError as error:
            if error.code != 404:
                raise
            req('POST', '/fields/main_site', token, {
                'field': 'events_content', 'type': 'json',
                'schema': {'is_nullable': True},
                'meta': {'interface': 'input-code', 'options': {'language': 'json'},
                         'special': ['cast-json'], 'width': 'full', 'sort': 20,
                         'translations': [{'language':'ru-RU','translation':'Сайт корпоративов'}]},
            })
    data=req('GET','/items/main_site?fields=events_content',token)['data']
    if data and data.get('events_content') is not None:
        print('Events content already initialized; preserving CMS edits.')
        return
    content=json.loads((Path(__file__).parent/'content/events-site.json').read_text())
    req('PATCH','/items/main_site',token,{'events_content':content})
    print('Events content initialized.')

if __name__=='__main__':
    main()
