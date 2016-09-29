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

Data structure and object templates in config JSON files:
   - I've split the data configurations into baselines (`config_blines.json`)and problem specificiations (`config_pspecs.json`). This is because the baseline information is _static_ but the problem specs will change over time, each time an analysis is doen the problem spec will be redefined and needs to be stored. This means that the scraper will create two collections/tables: baselines and problemSpecs. This _greatly_ simplifies the data structure _but_ it makes the business logic and server app more complex as it will need to do a join between collections. I have inserted a foreign key for each wealth group of the baseline and the analysis of the problemSpec will be tied to this.
   - The objects in the JSON config files will become documents/records loaded repeatedly into their respective collections/tables. If a JSON `MongoImport` documents were to be made from from the reads that follow these two templates, the documents would be elements of an array.
   - The app server business logic may need to test the alignment of the problem spec items with the baseline items to ensure they are congruent, before applying the analysis algorithm.



## The Analysis Algorithm

## Storing Calculations

## Presenting it to Users as an API
