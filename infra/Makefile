.PHONY: init plan apply all

all: init plan apply

init:
	cd azure && terraform init

plan:
	cd azure && terraform plan

apply:
	cd azure && terraform apply

create_prince:
	az ad sp create-for-rbac --name "lastpick-service-principle" --role contributor --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group-name}