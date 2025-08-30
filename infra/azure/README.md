# Azure Infrastructure for LastPick

This folder contains Terraform code to provision the necessary Azure infrastructure to host the LastPick React application.

## Prerequisites

- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)

## Infrastructure

The following resources will be created:

- **Azure Resource Group:** A container that holds related resources for an Azure solution.
- **Azure Storage Account:** Used to store the static files of the React application, with the static website feature enabled.

## Usage

1. **Initialize Terraform:**
   ```bash
   terraform init
   ```

2. **Plan the deployment:**
   ```bash
   terraform plan
   ```

3. **Apply the changes:**
   ```bash
   terraform apply
   ```

After the deployment is complete, the `static_website_endpoint` output variable will contain the URL of the hosted application.
