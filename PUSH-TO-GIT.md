# Đẩy code lên GitHub / GitLab

**Remote đã được cấu hình:** `origin` → `https://github.com/nghinh/TodoList.git`

## Bước 1: Tạo repo trên GitHub

1. Vào [github.com/new](https://github.com/new).
2. **Repository name:** `TodoList` (hoặc tên khác — nếu khác thì đổi remote bên dưới).
3. Chọn **Private** hoặc **Public**.
4. **Không** chọn "Add a README" — để repo trống.
5. Bấm **Create repository**.

## Bước 2: Push code

Trong terminal, tại thư mục project:

```bash
cd c:\temp\TodoList
git push -u origin master
```

Nếu bạn tạo repo với tên/user khác, sửa remote rồi push:

```bash
git remote set-url origin https://github.com/TEN_CUA_BAN/TEN_REPO.git
git push -u origin master
```

Nếu repo trên GitHub dùng nhánh mặc định là `main` thay vì `master`:

```bash
git branch -M main
git push -u origin main
```

Lần đầu push có thể cần đăng nhập (browser hoặc token/SSH key).
