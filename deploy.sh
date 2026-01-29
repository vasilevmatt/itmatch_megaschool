#!/bin/bash

# 🚀 Скрипт автоматического развертывания на TimeWeb Cloud

echo "🚀 Запуск развертывания на TimeWeb Cloud..."

# Проверяем наличие docker-compose
if [ ! -f "docker-compose.timeweb.yml" ]; then
    echo "❌ Ошибка: файл docker-compose.timeweb.yml не найден!"
    exit 1
fi

echo "✅ Конфигурация найдена"

# Запускаем развертывание
echo "🚀 Запуск статического фронтенда..."
docker-compose -f docker-compose.timeweb.yml up -d --build

echo ""
echo "✅ Развертывание запущено!"
echo ""
echo "📊 Проверить статус: docker-compose -f docker-compose.timeweb.yml ps"
echo "📜 Посмотреть логи: docker-compose -f docker-compose.timeweb.yml logs -f"
echo ""
echo "📖 Подробная инструкция: DEPLOY_GUIDE.md"
