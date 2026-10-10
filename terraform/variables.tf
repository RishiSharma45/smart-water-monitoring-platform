variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name prefix for resource naming and tagging"
  type        = string
  default     = "smart-water-monitor"
}

variable "instance_type" {
  description = "EC2 instance type (t3.micro is cost-optimal, 1 vCPU, 1 GiB RAM)"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Name of existing AWS KeyPair for SSH access"
  type        = string
  default     = "ubuntu-key"
}

variable "allowed_ssh_cidr" {
  description = "CIDR block permitted to connect via SSH (restricted to user's public IP)"
  type        = string
  default     = "128.185.168.200/32"
}

variable "root_volume_size" {
  description = "Root EBS gp3 volume size in GB (Free Tier covers up to 30 GB)"
  type        = number
  default     = 25
}
