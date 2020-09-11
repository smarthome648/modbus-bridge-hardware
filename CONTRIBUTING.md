
# Contributor guidelines

Thank you for considering contributing to 2Smart. 
People like you can make 2Smart a better tool.

You can use this project to add your devices to 2Smart Modbus Bridge. 
We have developed the features to make your contributions as easy as we can. 
If you need to add your device, but for any reason cannot make a pull request by yourself, 
create an issue and we will consider adding support for the device in future releases. 
Please, keep in mind that we will be able to add a device(requested by you) only if we can find 
one somewhere.

Following these guidelines helps to understand that you respect the time of 
the developers managing and developing this project. In return, 
they should reciprocate that respect in addressing your issue, assessing changes, 
and helping you finalize your pull requests.

## Branch Organization
Submit all changes directly to the master branch. We don’t use separate branches for development or for upcoming releases. We do our best to keep master in good shape, with all tests passing.

Code that lands in master must be compatible with the latest stable release. It may contain additional features, but no breaking changes. We should be able to release a new minor version from the tip of master at any time.

## What type of contributions you can do?

- The main purpose of this project is add ability for anyone to add their modbus devices to 2Smart.
Create a pull request with config for your device. See our [How to contribute](#How-to-contribute) steps.
- You can create an issue with bugs you have found, suggestions and questions.
- You can create a pull request with improvments in documentation and cli-instruments. We will look at these changes carefully.
- you can look at list of issues, and try to fix problems arrizing in community.

## How to contribute

### Contribution Prerequisites

- You have [Node](https://nodejs.org/en/) installed at v12.0.0+ and npm(installed as part of Node).
- You have 2Smart installed and running
- You have Modbus Bridge downloaded

### Your First Pull Request
Working on your first Pull Request? You can learn how from this free video series:

[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix. If nobody is working on it at the moment, please leave a comment stating that you intend to work on it so other people don’t accidentally duplicate your effort.

If somebody claims an issue but doesn’t follow up for more than two weeks, it’s fine to take it over but you should still leave a comment.

### Sending a Pull Request
The core team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation.

### Development Workflow

Configs format and cli instruments are described in [Readme](./README.md). Examples of configs can be found here !TO_DO_PUT_LINK.

- Fork repository
- Clone repository
- install dependencies(`npm i`)
- Put original device documantation to docs!TO_DO_PUT_LINK folder. It can be pdf, images, word file, html pages, etc. This will help us and outside contributors to fix bugs and make an improvements.
- Write [hardware](./hardware) config. It can be either js file exporting json, json file, or general js function(See [Readme](./README.md)).
Configs should use only native js(no require, no external calls, no filesystem interactions).
- Create device description file
- Test device
- Create pull request



