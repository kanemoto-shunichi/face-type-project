# ---------------------------------------------
# 1. VPC (仮想ネットワークの箱)
# ---------------------------------------------
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "facetype-vpc"
  }
}

# ---------------------------------------------
# 2. Subnets (部屋分け)
# ---------------------------------------------

# パブリックサブネット (インターネットからアクセス可能)
# ここにロードバランサー(ALB)を置きます
resource "aws_subnet" "public_1a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "ap-northeast-1a"
  tags = { Name = "facetype-public-1a" }
}

resource "aws_subnet" "public_1c" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "ap-northeast-1c"
  tags = { Name = "facetype-public-1c" }
}

# プライベートサブネット (インターネットから直接アクセス不可)
# ここにアプリ(Fargate)やDB(RDS)を隠します（セキュリティ重視）
resource "aws_subnet" "private_1a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "ap-northeast-1a"
  tags = { Name = "facetype-private-1a" }
}

resource "aws_subnet" "private_1c" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "ap-northeast-1c"
  tags = { Name = "facetype-private-1c" }
}

# ---------------------------------------------
# 3. Internet Gateway (インターネットへの出口)
# ---------------------------------------------
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id
  tags = { Name = "facetype-igw" }
}

# ---------------------------------------------
# 4. Route Table (道案内)
# ---------------------------------------------

# パブリック用ルートテーブル (インターネットへ行けるようにする)
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = { Name = "facetype-public-rt" }
}

# サブネットとの紐付け
resource "aws_route_table_association" "public_1a" {
  subnet_id      = aws_subnet.public_1a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_1c" {
  subnet_id      = aws_subnet.public_1c.id
  route_table_id = aws_route_table.public.id
}