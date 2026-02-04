<?php
// 阿里云虚拟主机数据库信息（和上面一模一样）
$servername = "sdm723419132.my3w.com";
$username = "sdm723419132";
$password = "Boshun810";
$dbname = "sdm723419132_db";

// 解决中文乱码
header('Content-Type: application/json; charset=utf-8');

// 连接数据库
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die(json_encode([])); // 连接失败返回空数组，不影响前端
}

// 查询数据库里的所有数据（按上传时间倒序，最新的在最前面）
$sql = "SELECT * FROM data_table ORDER BY create_time DESC";
$result = $conn->query($sql);

// 把数据整理成前端能识别的格式
$data = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $data[] = [
            "id" => $row['id'],
            "name" => $row['name'],
            "content" => $row['content'],
            "phone" => $row['phone'] ?? '', // 可选字段
            "email" => $row['email'] ?? '', // 可选字段
            "create_time" => $row['create_time']
        ];
    }
}

// 返回数据给前端
echo json_encode($data);

// 关闭连接
$conn->close();
?>