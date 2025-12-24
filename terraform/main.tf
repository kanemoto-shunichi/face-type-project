# AWSを使うよ、という宣言
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.0.0"
}

# 東京リージョンを指定
provider "aws" {
  region = "ap-northeast-1"
  
  # 全リソースに共通のタグをつける（コスト管理などで便利）
  default_tags {
    tags = {
      Project = "facetype"
      ManagedBy = "Terraform"
    }
  }
}