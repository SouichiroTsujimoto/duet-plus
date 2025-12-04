// e-class
export function addCalendarButtonToEclass() {
    // PC版: iframeを使用する場合
    // モバイル版: 直接ページにコンテンツがある場合
    // 両方のケースに対応する

    // 0. 科目一覧ページ（トップページ）にカレンダー登録リンクを追加
    injectCalendarLinkToTopPage();

    // 1. 直接ページをチェック（モバイル版の場合）
    waitForCsvButtonDirect(document, (csvButton, doc) => {
        injectCalendarButton(csvButton, doc);
    });

    // 2. iframeを探す（PC版の場合）
    waitForIframe('#ip-iframe', (iframe) => {
        // CSVダウンロードボタンが見つかるまで待機
        waitForCsvButtonInIframe(iframe, (csvButton, iframeDoc) => {
            injectCalendarButton(csvButton, iframeDoc);
        });
    });
}

// 科目一覧ページ（トップページ）にカレンダー登録の案内テキストを追加
function injectCalendarLinkToTopPage() {
    // 科目一覧ページかどうか確認
    // URLが /webclass/ で終わるか、/webclass/index.php を含む場合
    const url = window.location.href;
    const isTopPage = url.match(/\/webclass\/?(\?.*)?$/) || url.includes('/webclass/index.php');
    
    if (!isTopPage) return;
    
    // 「課題実施状況一覧」というタイトルを持つセクションを探す
    const sideBlockTitles = document.querySelectorAll('h4.side-block-title');
    
    sideBlockTitles.forEach(title => {
        if (title.textContent?.includes('課題実施状況一覧')) {
            // このタイトルの親要素内のmenugroupを探す
            const sideBlock = title.closest('.side-block');
            if (!sideBlock) return;
            
            const menugroup = sideBlock.querySelector('ul.menugroup');
            if (!menugroup) return;
            
            // 既に追加されていないか確認
            if (menugroup.querySelector('.duet-plus-calendar-text')) return;
            
            // 案内テキストを作成
            const li = document.createElement('li');
            li.className = 'duet-plus-calendar-text';
            
            const text = document.createElement('span');
            text.textContent = '» 締切日のカレンダー登録は「ダッシュボード」から';
            text.style.color = 'rgb(120, 120, 120)';
            text.style.fontSize = 'small';
            text.style.display = 'block';
            text.style.padding = '0.2em';
            
            li.appendChild(text);
            menugroup.appendChild(li);
        }
    });
}

// iframeがDOMに追加されるまで待機
function waitForIframe(selector: string, callback: (iframe: HTMLIFrameElement) => void) {
    const iframe = document.querySelector<HTMLIFrameElement>(selector);
    
    if (iframe) {
        callback(iframe);
        return;
    }
    
    // MutationObserverでiframeが追加されるのを監視
    const observer = new MutationObserver((_mutations, obs) => {
        const iframe = document.querySelector<HTMLIFrameElement>(selector);
        if (iframe) {
            obs.disconnect();
            callback(iframe);
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

// 直接ドキュメントでCSVダウンロードボタンが見つかるまで待機（モバイル版用）
function waitForCsvButtonDirect(
    doc: Document,
    callback: (csvButton: HTMLButtonElement, doc: Document) => void
) {
    const tryFind = (): boolean => {
        // URLが課題実施状況一覧ページかどうか確認
        if (!window.location.href.includes('score_summary_table/dashboard')) {
            return false;
        }
        
        // 「課題実施状況一覧」ページかどうか確認
        const h1 = Array.from(doc.querySelectorAll('h1'))
            .find(el => el.textContent?.includes('課題実施状況一覧'));
        
        if (!h1) return false;
        
        // CSVダウンロードボタンを探す
        const csvButton = Array.from(doc.querySelectorAll('button'))
            .find(btn => btn.textContent?.includes('CSVダウンロード')) as HTMLButtonElement | undefined;
        
        if (csvButton) {
            callback(csvButton, doc);
            return true;
        }
        return false;
    };
    
    // 既に見つかった場合
    if (tryFind()) return;
    
    // ポーリングで探す（Vue/Reactがデータを取得して描画するまで待つ）
    const interval = setInterval(() => {
        if (tryFind()) {
            clearInterval(interval);
        }
    }, 500);
    
    // 30秒後にタイムアウト
    setTimeout(() => {
        clearInterval(interval);
    }, 30000);
}

// CSVダウンロードボタンが見つかるまで待機（Vue/Reactが描画するまで待つ）- iframe版
function waitForCsvButtonInIframe(
    iframe: HTMLIFrameElement, 
    callback: (csvButton: HTMLButtonElement, iframeDoc: Document) => void
) {
    const tryFind = (): boolean => {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc) return false;
            
            // 「課題実施状況一覧」ページかどうか確認
            const h1 = Array.from(iframeDoc.querySelectorAll('h1'))
                .find(el => el.textContent?.includes('課題実施状況一覧'));
            
            if (!h1) return false;
            
            // CSVダウンロードボタンを探す
            const csvButton = Array.from(iframeDoc.querySelectorAll('button'))
                .find(btn => btn.textContent?.includes('CSVダウンロード')) as HTMLButtonElement | undefined;
            
            if (csvButton) {
                callback(csvButton, iframeDoc);
                return true;
            }
        } catch {
            // クロスオリジンエラーの場合は無視
        }
        return false;
    };
    
    // 既に見つかった場合
    if (tryFind()) return;
    
    // ポーリングで探す（Vue/Reactがデータを取得して描画するまで待つ）
    const interval = setInterval(() => {
        if (tryFind()) {
            clearInterval(interval);
        }
    }, 500);
    
    // 30秒後にタイムアウト
    setTimeout(() => {
        clearInterval(interval);
    }, 30000);
}

// カレンダーボタンを注入
function injectCalendarButton(_csvButton: HTMLButtonElement, iframeDoc: Document) {
    // 既にボタンが追加されていないか確認
    const existingButton = Array.from(iframeDoc.querySelectorAll('button'))
        .find(btn => btn.textContent?.includes('課題をカレンダーに登録'));
    
    if (existingButton) return;
    
    // すべてのCSVダウンロードボタンを探す（デスクトップ用とモバイル用の両方）
    const csvButtons = Array.from(iframeDoc.querySelectorAll('button'))
        .filter(btn => btn.textContent?.includes('CSVダウンロード')) as HTMLButtonElement[];
    
    // 各CSVボタンにカレンダーボタンを追加
    csvButtons.forEach(csvButton => {
        const calendarButton = iframeDoc.createElement('button');
        calendarButton.className = csvButton.className;
        calendarButton.textContent = '課題をカレンダーに登録';
        calendarButton.style.marginLeft = '8px';
        calendarButton.style.color = 'rgb(4, 4, 4)';
        calendarButton.style.backgroundColor = 'rgb(132, 255, 0)';
        
        // CSVダウンロードボタンの隣に挿入
        csvButton.parentElement?.appendChild(calendarButton);
        
        // ボタンクリック時の処理
        calendarButton.addEventListener('click', () => {
            const tasks = extractUncompletedTasks(iframeDoc);
            
            if (tasks.length === 0) {
                alert('未実施の課題が見つかりませんでした。');
                return;
            }
            
            const icsContent = generateICS(tasks);
            downloadICS(icsContent);
        });
    });
    
    // Googleカレンダー用の折りたたみボタンを追加（1回だけ）
    if (csvButtons.length > 0) {
        injectGoogleCalendarSection(csvButtons[0], iframeDoc);
    }
}

// Googleカレンダー登録URL用の折りたたみセクションを注入
function injectGoogleCalendarSection(csvButton: HTMLButtonElement, iframeDoc: Document) {
    // 既に追加されていないか確認
    if (iframeDoc.querySelector('#google-calendar-section')) return;
    
    const parentDiv = csvButton.parentElement?.parentElement;
    if (!parentDiv) return;
    
    // 折りたたみセクションを作成
    const details = iframeDoc.createElement('details');
    details.id = 'google-calendar-section';
    details.style.cssText = 'margin-top: 12px; border: 1px solid #e5e7eb; border-radius: 4px; padding: 8px;';
    
    const summary = iframeDoc.createElement('summary');
    summary.textContent = 'Googleカレンダーへの締め切り登録URL';
    summary.style.cssText = 'cursor: pointer; font-weight: 600; padding: 4px;';
    details.appendChild(summary);
    
    // 課題一覧のコンテナ
    const taskList = iframeDoc.createElement('div');
    taskList.id = 'google-calendar-task-list';
    taskList.style.cssText = 'margin-top: 8px; max-height: 300px; overflow-y: auto;';
    details.appendChild(taskList);
    
    // 折りたたみが開かれた時に課題を読み込む
    details.addEventListener('toggle', () => {
        if (details.open) {
            updateGoogleCalendarTaskList(iframeDoc, taskList);
        }
    });
    
    // 親要素の後に挿入
    parentDiv.insertAdjacentElement('afterend', details);
}

// Googleカレンダー用タスクリストを更新
function updateGoogleCalendarTaskList(iframeDoc: Document, taskList: HTMLElement) {
    const tasks = extractUncompletedTasks(iframeDoc);
    
    // 既存の内容をクリア
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<p style="color: #6b7280; padding: 8px;">未実施の課題が見つかりませんでした。</p>';
        return;
    }
    
    // 締切日が近い順にソート
    tasks.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
    
    // 各課題のリンクを作成
    tasks.forEach(task => {
        const linkContainer = iframeDoc.createElement('div');
        linkContainer.style.cssText = 'padding: 6px 8px; border-bottom: 1px solid #f3f4f6;';
        
        const link = iframeDoc.createElement('a');
        link.href = generateGoogleCalendarUrl(task);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.style.cssText = 'color: #2563eb; text-decoration: none; display: block;';
        link.addEventListener('mouseover', () => { link.style.textDecoration = 'underline'; });
        link.addEventListener('mouseout', () => { link.style.textDecoration = 'none'; });
        
        // 締切日時をフォーマット
        const deadlineStr = formatDateTimeJP(task.deadline);
        link.innerHTML = `
            <div style="font-weight: 500;">【e-class課題締切】${escapeHTML(task.taskName)}</div>
            <div style="font-size: 0.875rem; color:rgb(0, 0, 0); margin-top: 2px;">
                ${escapeHTML(task.courseName)} | <span style="color:rgb(204, 0, 0);">締切日時: ${deadlineStr}</span>
            </div>
        `;
        
        linkContainer.appendChild(link);
        taskList.appendChild(linkContainer);
    });
}

// GoogleカレンダーのURLを生成
function generateGoogleCalendarUrl(task: Task): string {
    const title = encodeURIComponent(`【e-class課題締切】${task.taskName}`);
    const details = encodeURIComponent(task.courseName);
    const dateStr = formatGoogleCalendarDate(task.deadline);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateStr}/${dateStr}&details=${details}`;
}

// GoogleカレンダーURL用の日時フォーマット（YYYYMMDDTHHmmss）
function formatGoogleCalendarDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

// 日本語の日時フォーマット
function formatDateTimeJP(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// HTMLエスケープ
function escapeHTML(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// 課題データの型定義
interface Task {
    courseName: string;  // 授業名
    taskName: string;    // 課題名
    deadline: Date;      // 締切日時
}

// 未実施の課題を抽出
function extractUncompletedTasks(iframeDoc: Document): Task[] {
    const tasks: Task[] = [];
    const now = new Date();
    
    // 各授業セクションを探す（bg-blue-100 のdiv）
    const courseDivs = iframeDoc.querySelectorAll('div.bg-blue-100');
    
    courseDivs.forEach(courseDiv => {
        // 授業名を取得
        const courseLink = courseDiv.querySelector('a.font-semibold');
        const courseName = courseLink?.textContent?.trim().replace(/^[》»\s]+/, '') || '不明な授業';
        
        // 親要素（mt-2のdiv）を取得し、その中のテーブルを探す
        const parentDiv = courseDiv.parentElement;
        if (!parentDiv) return;
        
        const table = parentDiv.querySelector('table');
        if (!table) return;
        
        // テーブルの各行を処理
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                const taskName = cells[0]?.textContent?.trim() || '';
                const deadlineCell = row.querySelector('td[data-test="締切"]');
                const executionCell = row.querySelector('td[data-test="実施日"]');
                
                const deadlineText = deadlineCell?.textContent?.trim() || '';
                const executionText = executionCell?.textContent?.trim() || '';
                
                // 締切があり、実施日が「-」または空の場合は未実施
                if (deadlineText && deadlineText !== '-' && deadlineText !== '' &&
                    (executionText === '-' || executionText === '')) {
                    
                    const deadline = parseDateTime(deadlineText);
                    // 締切が現在時刻より未来の場合のみ追加（期限切れを除外）
                    if (deadline && deadline > now) {
                        tasks.push({
                            courseName: courseName,
                            taskName: taskName,
                            deadline: deadline
                        });
                    }
                }
            }
        });
    });
    
    return tasks;
}

// 日時文字列をDateオブジェクトに変換 (例: "2025-12-20 14:09")
function parseDateTime(dateTimeStr: string): Date | null {
    const match = dateTimeStr.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/);
    if (!match) return null;
    
    const [, year, month, day, hour, minute] = match;
    return new Date(
        parseInt(year),
        parseInt(month) - 1,  // 月は0始まり
        parseInt(day),
        parseInt(hour),
        parseInt(minute)
    );
}

// DateをICS形式の日時文字列に変換 (例: "20251220T140900")
function formatICSDate(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`;
}

// 決定論的なUIDを生成（同じ課題なら同じUIDになる）
function generateUID(courseName: string, taskName: string, deadline: Date): string {
    const dateStr = formatICSDate(deadline);
    const input = `${courseName}|${taskName}|${dateStr}`;
    // 簡易ハッシュ関数
    const hash = simpleHash(input);
    return `eclass-${hash}@duet-plus`;
}

// 簡易ハッシュ関数（djb2アルゴリズム）
function simpleHash(str: string): string {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i);
        hash = hash & hash; // 32bit整数に変換
    }
    // 正の数に変換して16進数文字列に
    return Math.abs(hash).toString(16);
}

// ICSファイルを生成
function generateICS(tasks: Task[]): string {
    const events = tasks.map(task => {
        const dtStart = formatICSDate(task.deadline);
        const uid = generateUID(task.courseName, task.taskName, task.deadline);
        
        // サマリーとdescriptionをエスケープ（タイトルに【e-class課題締切】を追加）
        const summary = escapeICSText(`【e-class課題締切】${task.taskName}`);
        const description = escapeICSText(task.courseName);
        
        return `BEGIN:VEVENT
DTSTART:${dtStart}
DTEND:${dtStart}
SUMMARY:${summary}
DESCRIPTION:${description}
UID:${uid}
END:VEVENT`;
    }).join('\n');
    
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//DUET+//e-class tasks//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
${events}
END:VCALENDAR`;
}

// ICSテキストのエスケープ
function escapeICSText(text: string): string {
    return text
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');
}

// ICSファイルをカレンダーアプリで開く
function downloadICS(icsContent: string): void {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    
    // まずwindow.openを試す（カレンダーアプリが関連付けされていれば開く）
    const newWindow = window.open(blobUrl, '_blank');
    
    // ポップアップがブロックされた場合や、開けなかった場合はダウンロードにフォールバック
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // ダウンロード形式にフォールバック
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'eclass-tasks.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
    
    // 少し待ってからURLを解放
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
}