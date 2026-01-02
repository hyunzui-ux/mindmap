// 현재 활성화된 노드를 저장하는 변수
let activeNode = null;

// 마인드맵 데이터 (시계방향: 왼쪽위 → 오른쪽위 → 오른쪽아래 → 왼쪽아래)
const mindmapData = [
    {
        id: 'market',
        title: '글로벌 시장 경제',
        color: 'bg-blue-500',
        icon: 'trending-up',
        details: '2033년 50조 원 규모 성장 전망. 연평균 25~35% 초고속 성장 섹터.',
        sub: ['AI 아트 시장 규모', '데이터 가치 상승', '생산 구조 재편']
    },
    {
        id: 'conflict',
        title: '이익 불균형 & 갈등',
        color: 'bg-amber-500',
        icon: 'arrows',
        details: '거대 AI 기업의 무단 학습 vs 개인 창작자의 보상 부재. 집단 소송 확산.',
        sub: ['무단 학습 소송', '라이선스 격차', '수익 분배 불평등']
    },
    {
        id: 'solution',
        title: '공정 분배 해법',
        color: 'bg-emerald-500',
        icon: 'shield',
        details: '기술적 표준(DDEX) 마련, 인간 창작성 중심의 법적 해석, 상업적 보상 체계.',
        sub: ['AI 크레딧 표준화', '데이터 선택권 확보', '상업적 책임 모델']
    },
    {
        id: 'risk',
        title: '전가되는 리스크',
        color: 'bg-rose-500',
        icon: 'alert',
        details: '학습 단계의 법적 비용 증가 및 플랫폼의 AI 스팸 콘텐츠 관리 부담.',
        sub: ['소송 리스크 비용화', '플랫폼 정산 왜곡', '저품질 콘텐츠 대량유통']
    }
];

// 아이콘 SVG (간단한 버전)
const icons = {
    'trending-up': '<path d="M22 7L13.5 15.5L8.5 10.5L2 17"/><polyline points="16 7 22 7 22 13"/>',
    'arrows': '<path d="M7 16l-4-4m0 0l4-4m-4 4h18"/><path d="M17 8l4 4m0 0l-4 4m4-4H3"/>',
    'alert': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'
};

// 아이콘 만들기 함수
function createIcon(iconName, size = 20) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icons[iconName]}</svg>`;
}

// 노드 클릭 이벤트
function toggleNode(nodeId) {
    // 같은 노드를 다시 클릭하면 닫기
    if (activeNode === nodeId) {
        activeNode = null;
    } else {
        activeNode = nodeId;
    }
    
    // 노드 다시 그리기
    renderNodes();
}

// 노드 그리기 함수
function renderNodes() {
    const container = document.getElementById('nodes-container');
    container.innerHTML = ''; // 기존 내용 지우기
    
    // 각 노드의 위치 (각도) - 왼쪽위부터 시계방향
    const angles = [135, 45, 315, 225]; // 왼쪽위, 오른쪽위, 오른쪽아래, 왼쪽아래
    const distance = 300; // 중앙에서 거리
    
    mindmapData.forEach((node, i) => {
        const angle = angles[i];
        const x = distance * Math.cos((angle * Math.PI) / 180);
        const y = distance * Math.sin((angle * Math.PI) / 180);
        
        // 노드 div 만들기
        const nodeDiv = document.createElement('div');
        nodeDiv.className = 'absolute transition-all duration-300 transform';
        nodeDiv.style.transform = `translate(${x}px, ${y}px)`;
        
        // 노드 버튼
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
        
        // 상세 정보 박스 (활성화된 경우만)
        if (activeNode === node.id) {
            const detailBox = document.createElement('div');
            detailBox.className = 'detail-box absolute top-full left-0 mt-4 w-64 bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-2xl z-20';
            
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
    
    // 연결선 그리기
    drawConnections();
}

// 연결선 그리기 함수
function drawConnections() {
    const svg = document.getElementById('connections');
    
    // 기존 선 지우기
    const existingLines = svg.querySelectorAll('line');
    existingLines.forEach(line => line.remove());
    
    // 새로운 선 그리기
    const angles = [135, 45, 315, 225]; // 왼쪽위, 오른쪽위, 오른쪽아래, 왼쪽아래
    mindmapData.forEach((node, i) => {
        const angle = angles[i];
        const x2 = 50 + 38 * Math.cos((angle * Math.PI) / 180);
        const y2 = 50 + 38 * Math.sin((angle * Math.PI) / 180);
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '50%');
        line.setAttribute('y1', '50%');
        line.setAttribute('x2', `${x2}%`);
        line.setAttribute('y2', `${y2}%`);
        line.setAttribute('stroke', '#334155');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke-dasharray', '5,5');
        
        svg.appendChild(line);
    });
}

// 페이지 로드 시 노드 그리기
window.addEventListener('DOMContentLoaded', () => {
    renderNodes();
});

// 창 크기 변경 시 연결선 다시 그리기
window.addEventListener('resize', () => {
    drawConnections();
});