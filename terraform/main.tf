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
    username = format("student-%s", u)
  }]

  user_map = { for user in local.users : user.username => user }
}

# create IAM users
resource "aws_iam_user" "students" {
  for_each = local.user_map
  name     = each.value.username
}

# create access keys for the IAM users
resource "aws_iam_access_key" "student_keys" {
  for_each = aws_iam_user.students
  user     = aws_iam_user.students[each.key].name
}

resource "aws_iam_user_login_profile" "student_logins" {
  for_each                = aws_iam_user.students
  user                    = aws_iam_user.students[each.key].name
  password_reset_required = false
}

# EC2: create only one fixed size
resource "aws_iam_user_policy" "ec2_policy" {
  for_each = aws_iam_user.students
  name     = "workshop-student-${each.key}-ec2"
  user     = aws_iam_user.students[each.key].name

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : "*",
        "Resource" : "arn:aws:ec2:::smuworkshop-${each.key}/*",
        "Condition" : {
          "StringEquals" : {
            "ec2:InstanceType" : "t2.micro"
          }
        }
      },
      {
        "Effect" : "Allow",
        "Action" : ["ec2:DescribeKeyPairs", "ec2:CreateKeyPairs", "ec2:DescribeVpcs",
          "ec2:CreateVpcs", "ec2:DescribeSubnets", "ec2:CreateSubnets", "ec2:DescribeImages",
          "ec2:CreateImages", "ec2:DescribeSecurityGroups", "ec2:RunInstances", "ec2:CreateTags",
        "ec2:DescribeInstances", "ec2:DescribeInstanceStatus"],
        "Resource" : "*",
      }
    ]
  })
}

# special naming for aurora serverless instance for each student
resource "aws_iam_user_policy" "aurora_serverless_policy" {
  for_each = aws_iam_user.students
  name     = "workshop-student-${each.key}-aurora-serverless"
  user     = aws_iam_user.students[each.key].name

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : "*",
        "Resource" : "arn:aws:rds:::smuworkshop-${each.key}/*",
        "Condition" : {
          "StringEquals" : {
            "rds:Engine" : "aurora",
            "rds:DBClusterClass" : "db.serverless"
          }
        }
      }
    ]
    }
  )
}

# special s3 naming policy for each student
resource "aws_iam_user_policy" "workshop_student_s3" {
  for_each = aws_iam_user.students
  name     = "workshop-student-${each.key}-s3"
  user     = aws_iam_user.students[each.key].name

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : ["s3:CreateBucket", "s3:PutEncryptionConfiguration", "s3:PutBucketPolicy", "s3:PutBucketAcl", "s3:ListAllMyBuckets"],
        "Resource" : "*"
      },
      {
        "Effect" : "Allow",
        "Action" : "*",
        "Resource" : "arn:aws:s3:::smuworkshop-${each.key}/*"
      }
    ]
  })
}

# generate a CSV file with user credentials
locals {
  combined = [
    for k, user in aws_iam_user.students : {
      user   = user.name
      key    = aws_iam_access_key.student_keys[k].id
      secret = aws_iam_access_key.student_keys[k].secret
      pass   = aws_iam_user_login_profile.student_logins[k].password
    }
  ]
}

resource "local_file" "credentials" {
  filename = "creds.csv"
  content  = <<-EOF
    User,Password,AccessKey,SecretKey
    ${join("\n", [for item in local.combined : format("%s,%s,%s,%s", item.user, item.pass, item.key, item.secret)])}
  EOF
}
