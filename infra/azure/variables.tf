
variable "resource_group_name" {
  description = "The name of the resource group."
  type        = string
  default     = "lastpick-rg"
}

variable "location" {
  description = "The Azure region where the resources will be created."
  type        = string
  default     = "North Europe"
}

variable "storage_account_name" {
  description = "The name of the storage account."
  type        = string
  default     = "lastpicksa" # Change this to a unique name
}
