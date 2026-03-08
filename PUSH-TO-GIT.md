# Đẩy code lên GitHub / GitLab

Sau khi tạo repository trống trên GitHub (hoặc GitLab), chạy trong thư mục project:

```bash
cd c:\temp\TodoList

# Thêm remote (thay YOUR_USERNAME và REPO_NAME bằng của bạn)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
# hoặc SSH: git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# Đẩy nhánh master lên
git push -u origin master
```

Nếu repo trên GitHub dùng nhánh mặc định là `main` thay vì `master`:

```bash
git branch -M main
git push -u origin main
```

Lần đầu push có thể cần đăng nhập (browser hoặc token/SSH key).
