import logging
import time
from random import randint
from datetime import datetime
import traceback
import threading
import re

import click
import selenium.webdriver
import selenium.common.exceptions


def try_link(driver, link):
    driver.get(link)
    driver.maximize_window()
    
    initial_time = datetime.now()

    while True:
        click.echo('Searching for join button.')
        if (datetime.now() - initial_time).seconds > 20:
            return False
        join_group_buttons = driver.find_elements_by_xpath("//*[contains(text(), 'הצטרף') or contains(text(), 'join') or contains(text(), 'Join')]")
        if join_group_buttons:
            click.echo('V')
            for join_group_button in join_group_buttons:
                time.sleep(2)
                join_group_button.click()
                return True
        else:
            click.echo('X')
        time.sleep(0.5)


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

    driver = selenium.webdriver.Firefox()
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


if __name__ == '__main__':
    main()
