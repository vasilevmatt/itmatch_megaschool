@echo off
chcp 65001 >nul

echo 🚀 Запуск развертывания на TimeWeb Cloud...
echo.

REM Проверяем наличие необходимых файлов
if not exist "docker-compose.timeweb.yml" (
    echo ❌ Ошибка: файл docker-compose.timeweb.yml не найден!
    pause
    exit /b 1
)

echo ✅ Конфигурация найдена
echo.

REM Запускаем развертывание
echo 🚀 Запуск развертывания...
docker-compose -f docker-compose.timeweb.yml up -d --build

echo.
echo ✅ Развертывание запущено!
echo.
echo 📊 Проверить статус: docker-compose -f docker-compose.timeweb.yml ps
echo 📜 Посмотреть логи: docker-compose -f docker-compose.timeweb.yml logs -f
echo.
echo 📖 Подробная инструкция: DEPLOY_GUIDE.md
echo.
pause
