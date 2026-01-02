function renderNodes() {
    const container = document.getElementById('nodes-container');
    container.innerHTML = '';

    const angles = [135, 45, 315, 225];
    const distance = 300;

    mindmapData.forEach((node, i) => {
        const angle = angles[i];
        const x = distance * Math.cos((angle * Math.PI) / 180);
        const y = distance * Math.sin((angle * Math.PI) / 180);

        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'absolute transition-all duration-300';
        nodeDiv.style.left = '50%';
        nodeDiv.style.top = '50%';
        nodeDiv.style.transform = `
            translate(-50%, -50%)
            translate(${x}px, ${y}px)
        `;

        const button = document.createElement('button');
        button.className = `node-button ${node.color} hover:scale-110 transition-transform p-4 rounded-xl shadow-lg flex flex-col items-center w-40 border border-white/20`;
        button.onclick = () => toggleNode(node.id);

        button.innerHTML = `
            <div class="bg-white/20 p-2 rounded-lg mb-2">
                ${createIcon(node.icon, 20)}
            </div>
            <span class="font-bold text-sm">${node.title}</span>
        `;

        nodeDiv.appendChild(button);

        if (activeNode === node.id) {
            const detailBox = document.createElement('div');
            detailBox.className = 'detail-box absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-2xl z-20';

            let subItemsHTML = '';
            node.sub.forEach(text => {
                subItemsHTML += `
                    <div class="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded border border-slate-700">
                        ${createIcon('zap', 12)}
                        ${text}
                    </div>
                `;
            });

            detailBox.innerHTML = `
                <p class="text-xs text-indigo-300 font-bold uppercase mb-2 tracking-wider">상세 분석</p>
                <p class="text-sm text-slate-300 mb-4 leading-relaxed">${node.details}</p>
                <div class="space-y-2">
                    ${subItemsHTML}
                </div>
            `;

            nodeDiv.appendChild(detailBox);
        }

        container.appendChild(nodeDiv);
    });

    drawConnections();
}

