# HEA-Analysis

## Scraping the Spreadsheets

An attempt to move the FEG Single-Zone Analysis Spreadsheets into a database for ongoing, multi-country analysis.
First up is to scrape the existing spreadsheets. The config_szacs file serves as a _template_ for scraping the data off the spreadsheets and into a database (MongoDB? PostgreSQL? _jury still out_).

Spreadsheet structure:
   - Livelihood Zone **Name** (`lz_name`), **Code** (`lz_code`), **Abbreviation** (`lz_abbrev`).
   - Wealth groups and sheets (`wg_name`, `wg_code`(?)) and `wg_sh_name` -> **V.Poor**, **Poor**, **Middle** and **Rich**.
   - Livelihood strategies divide into **Food Sources**, **Income Sources**, **Expenditure Items**. There are many of each of these to one Baseline.
   - Each strategy has a **Baseline**, **Expandability** and **Problem**. There is also extra information: **Household Size**, **Staple**, **Food Energy Requirements** as well.
   - Problems occur over _time_ (when the analysis takes place), so they have a **Analysis Date**. There can be _many_ problems on different occasions or Analysis Dates to each Food Source, Income Source, Expenditure Item and Food Energy Requirement in each Baseline.
   - On a particular Analysis date, there can be different **Hazards** or **Scenarios**. There are many Hazards or Scanerios to one Anaysis date
   - There Problems for **Quantity** and **Price** for Income Sources and Expenditure Items and **Quanitity** only for Food Sources.

## The Analysis Algorithm

## Storing Calculations

## Presenting it to Users as an API
