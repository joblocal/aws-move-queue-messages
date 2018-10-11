# AWS move Queue messages

![Downloads](https://img.shields.io/npm/dt/@joblocal\/aws-move-queue-messages.svg)

This Project provides a CLI tool for moving messages from one AWS SQS queue to another.
For example to run failed messages from your deadletter queues again.

## Requirements
- AWS environment configuration
- Yarn or npm
- Node

## Installation

Using yarn:
```sh
$ yarn global add @joblocal/aws-move-queue-messages
```

Using npm:

```sh
$ npm install -g @joblocal/aws-move-queue-messages
```

### Usage
Before you can use this package you need to configure your AWS environment
variables. The easiest way is to use [AWS CLI](https://aws.amazon.com/de/cli/).

After installing the package you can use it as follows.

```sh
$ aws-move-queue-messages
```

## Built with
* [Yarn](https://yarnpkg.com/lang/en/) - Dependency Management
* [Jest](https://facebook.github.io/jest/) - Test Runner

## Contributing
Please read through our [contributing guidelines](https://github.com/joblocal/aws-move-queue-messages/blob/master/CONTRIBUTING.md). Included are directions for opening issues, coding standards, and feature requests.


## Authors
* **Joblocal GmbH** - *Initial work* - [Joblocal](https://github.com/joblocal)

See also the list of [contributors](https://github.com/joblocal/aws-move-queue-messages/contributors) who participated in this project.
