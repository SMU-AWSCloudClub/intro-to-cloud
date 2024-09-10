provider "aws" {
  alias  = "default"
  region = "ap-southeast-1"
}

# Define the number of users
variable "number_of_users" {
  description = "Number of users to create"
  type        = number
  default     = 10
}

# Local block to generate a list of users and a user map
locals {
  users = [for u in range(1, var.number_of_users + 1) : {
    user_id  = u
    username = format("student%s", u)
  }]

  user_map = { for user in local.users : user.username => user }
}

# Create IAM users
resource "aws_iam_user" "students" {
  for_each = local.user_map
  name     = each.value.username
}

# Create access keys for the IAM users
resource "aws_iam_access_key" "student_keys" {
  for_each = aws_iam_user.students
  user     = aws_iam_user.students[each.key].name
}

# Create a custom read-write policy for S3 and EC2
resource "aws_iam_policy" "custom_rw_policy" {
  name = "CustomReadWritePolicy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:RunInstances",
        "ec2:StopInstances",
        "ec2:TerminateInstances"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

# Attach the custom policy to each user
resource "aws_iam_user_policy_attachment" "student_custom_policy" {
  for_each   = aws_iam_user.students
  user       = aws_iam_user.students[each.key].name
  policy_arn = aws_iam_policy.custom_rw_policy.arn
}

# Generate a CSV file with user credentials
locals {
  combined = [
    for k, user in aws_iam_user.students : {
      user   = user.name
      key    = aws_iam_access_key.student_keys[k].id
      secret = aws_iam_access_key.student_keys[k].secret
    }
  ]
}

resource "local_file" "credentials" {
  filename = "creds.csv"
  content  = <<-EOF
    User,AccessKey,SecretKey
    ${join("\n", [for item in local.combined : format("%s,%s,%s", item.user, item.key, item.secret)])}
  EOF
}
