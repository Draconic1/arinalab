1. создать пользователя бд 
  имя arina пароль 1234
  authentication type: Standard !!!!

2. перенос проекта:
  git init
  git clone https://github.com/Draconic1/arinalab.git

3. запустить бэк
  запустить в воркбенче arina.sql
 
  после первого запуска удалить в файле server.js (бэк)
  30 строка заменить: .sync({ force: true}) на  .sync({ })
  удалить 33 строку

______________________________

1. админка:
  cd backend
  cd npm run mysql-admin
  http://127.0.0.1:8082/
  admin
  QQqq33

2. пользователь админ на фронтенде:
  лог: admin
  пароль: admin
