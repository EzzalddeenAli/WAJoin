import logging
import time
from random import randint
from datetime import datetime
import traceback
import threading
import re
import gzip

import click
import selenium.webdriver
import selenium.common.exceptions
import seleniumwire.webdriver
import lxml.html
import lxml.html.builder


@click.argument('link')
@click.command()
def main(link):
    regular_link_regex = re.compile(r'https:\/\/chat.whatsapp.com\/([a-zA-Z0-9]+)')
    web_link_regex = re.compile(r'https:\/\/web.whatsapp.com\/accept\?code=[a-zA-Z0-9]+')

    regular_match = regular_link_regex.match(link)
    if regular_match:
        new_link = 'https://web.whatsapp.com/accept?code=' + regular_match.group(1)
        click.echo('Converted from chat link to WhatsApp web link {} -> {}'.format(link, new_link))
        link = new_link
        
    if not web_link_regex.match(link):
        raise click.ClickException('The given link could not be parsed as a valid whatsapp group link.')

    click.echo('Starting...')

    driver = seleniumwire.webdriver.Firefox(seleniumwire_options={'custom_response_handler': inject})
    while True:
        success = False
        try:
            click.echo('Trying to join.')
            success = try_link(driver, link)
        except click.ClickException:
            raise
        except selenium.common.exceptions.NoSuchWindowException:
            raise click.ClickException('The browser window was closed in the middle.')
        except Exception:
            track = traceback.format_exc()
            raise click.ClickException(track)

        if success:
            sleep_interval = randint(60, 120)
            click.echo('Sleeping for {} seconds'.format(sleep_interval))
            time.sleep(sleep_interval)


def try_link(driver, link):
    driver.get(link)
    time.sleep(10000)
    driver.maximize_window()
    
    initial_time = datetime.now()

    while True:
        click.echo('Searching for join button.')
        if (datetime.now() - initial_time).seconds > 20:
            return False
        join_group_buttons = driver.find_elements_by_xpath("//*[contains(text(), 'הצטרף') or contains(text(), 'join') or contains(text(), 'Join')]")
        if join_group_buttons:
            for join_group_button in join_group_buttons:
                time.sleep(2)
                try:
                    join_group_button.click()
                except selenium.common.exceptions.StaleElementReferenceException as e:
                    click.echo('Failed to click on the button that was found :(')
                else:
                    click.echo('Clicked the join button :)')
                return True
        else:
            click.echo('Did not find any join button to click :(')
        time.sleep(0.5)


INJECTED_SCRIPT = lxml.html.builder.SCRIPT('''

console.log('Running injected script.')

const originalSetItem = window.localStorage.setItem
const newSetItem = function (key, value) {
    if (key === 'WALangPref') {
        value = 'he'
    }
    originalSetItem.apply(localStorage, arguments)
}
window.localStorage.__proto__.setItem = newSetItem

''')


def inject(req, req_body, res, res_body):
    if res.headers.get_content_subtype() != 'html' or res.status != 200:
        return
        
    # res.headers['wa_lang_pref'] = 'he'
    
    parsed_html = lxml.html.fromstring(gzip.decompress(res_body))
    
    parsed_html.head.insert(0, INJECTED_SCRIPT)
    return gzip.compress(lxml.html.tostring(parsed_html))


if __name__ == '__main__':
    main()

