output "instance_id" {
  description = "ID of the deployed EC2 instance"
  value       = aws_instance.smart_water_server.id
}

output "public_ip" {
  description = "Public IPv4 address of the Smart Water Monitor instance"
  value       = aws_instance.smart_water_server.public_ip
}

output "public_dns" {
  description = "Public DNS hostname of the EC2 instance"
  value       = aws_instance.smart_water_server.public_dns
}

output "http_url" {
  description = "Direct HTTP URL to access the Smart Water Monitor dashboard"
  value       = "http://${aws_instance.smart_water_server.public_ip}"
}

output "ssh_command" {
  description = "SSH connection command for administrator"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_instance.smart_water_server.public_ip}"
}

output "security_group_id" {
  description = "Security group ID attached to the EC2 instance"
  value       = aws_security_group.smart_water.id
}
