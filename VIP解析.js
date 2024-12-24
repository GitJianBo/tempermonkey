// ==UserScript==
// @name         一键解析
// @namespace    https://example.com
// @version      1.3
// @description  点击按钮跳转到 https://jx.xmflv.cc/?url=(当前地址)，并支持拖动
// @author       你的名字
// @match        *://*.iqiyi.com/*
// @match        *://*.v.qq.com/*
// @match        *://v.qq.com/*
// @match        *://www.youku.com/*
// @match        *://*.mgtv.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 创建样式
    const style = document.createElement('style');
    style.innerHTML = `
        .custom-jump-button {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 12px 24px;
            font-size: 16px;
            color: white;
            background: linear-gradient(45deg, #6a5acd, #4169e1);
            border: none;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            cursor: move; /* 改变鼠标样式以显示可拖动 */
            transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .custom-jump-button:hover {
            background: linear-gradient(45deg, #4169e1, #6a5acd);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
        }
    `;
    document.head.appendChild(style);

    // 创建按钮
    const button = document.createElement('button');
    button.innerText = '跳转到解析页面';
    button.className = 'custom-jump-button';

    // 按钮初始位置
    button.style.left = 'auto';
    button.style.right = '20px';
    button.style.top = '80px';
    button.style.position = 'fixed';

    // 拖动相关变量
    let isDragging = false; // 是否正在拖动
    let hasMoved = false;   // 是否发生过移动
    let offsetX = 0, offsetY = 0; // 鼠标相对按钮的位置

    // 按下鼠标开始拖动
    button.addEventListener('mousedown', (e) => {
        isDragging = true;
        hasMoved = false; // 重置移动状态
        offsetX = e.clientX - button.getBoundingClientRect().left;
        offsetY = e.clientY - button.getBoundingClientRect().top;
        button.style.transition = 'none'; // 拖动时禁用过渡效果
    });

    // 鼠标移动更新位置
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            hasMoved = true; // 标记发生过移动
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            button.style.left = `${x}px`;
            button.style.top = `${y}px`;
            button.style.right = 'auto'; // 防止与 `right` 样式冲突
        }
    });

    // 松开鼠标停止拖动
    document.addEventListener('mouseup', () => {
        isDragging = false;
        button.style.transition = 'box-shadow 0.3s ease, transform 0.3s ease'; // 恢复过渡效果
    });

    // 点击事件，只有未发生拖动时才触发
    button.addEventListener('click', (e) => {
        if (hasMoved) {
            // 如果发生过拖动，阻止点击事件
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        // 未拖动，正常跳转
        const currentUrl = window.location.href; // 获取当前地址（未编码）

        // 根据域名判断跳转逻辑
        let targetUrl;
        targetUrl = `https://jx.xmflv.cc/?url=${encodeURIComponent(currentUrl)}`;

        // 跳转到目标 URL
        window.location.href = targetUrl;
    });

    // 添加按钮到页面
    document.body.appendChild(button);
})();
