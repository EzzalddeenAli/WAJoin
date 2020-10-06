import logging
import time
from random import randint
from datetime import datetime
import traceback

import click
import selenium.webdriver
import selenium.common.exceptions


def try_link(driver, link):
    driver.get(link)
    driver.maximize_window()
    
    initial_time = datetime.now()

    while True:
        if (datetime.now() - initial_time).seconds > 20:
            return False
        join_group_buttons = driver.find_elements_by_xpath("//*[contains(text(), 'הצטרף')]")
        if join_group_buttons:
            click.echo('V')
            for join_group_button in join_group_buttons:
                join_group_button.click()
                return True
        else:
            click.echo('X')
        time.sleep(0.5)


@click.argument('link')
@click.command()
def main(link):
    click.echo('Starting...')

    driver = selenium.webdriver.Firefox()
    while True:
        success = False
        try:
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
            click.echo('Sleeping for %d seconds', sleep_interval)
            time.sleep(sleep_interval)


if __name__ == '__main__':
    main()
