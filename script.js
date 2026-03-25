document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('codeInput');
    const explainBtn = document.getElementById('explainBtn');
    const resultsSection = document.getElementById('resultsSection');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const explanationContainer = document.getElementById('explanationContainer');
    const summaryCard = document.getElementById('summaryCard');
    const summaryText = document.getElementById('summaryText');
    const btnText = document.querySelector('.btn-text');
    const btnIcon = document.querySelector('.fa-wand-magic-sparkles');

    explainBtn.addEventListener('click', () => {
        const code = codeInput.value.trim();
        
        if (!code) {
            // Flash a visual feedback if input is empty
            codeInput.parentElement.parentElement.style.animation = 'shake 0.5s ease';
            setTimeout(() => {
                codeInput.parentElement.parentElement.style.animation = '';
            }, 500);
            return;
        }

        startExplanationProcess(code);
    });

    // Handle Tab key in textarea
    codeInput.addEventListener('keydown', function(e) {
        if (e.key == 'Tab') {
            e.preventDefault();
            var start = this.selectionStart;
            var end = this.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            this.value = this.value.substring(0, start) +
                "    " + this.value.substring(end);

            // put caret at right position again
            this.selectionStart =
                this.selectionEnd = start + 4;
        }
    });

    // Shake animation keyframes inject
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); border-color: #ef4444; }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); border-color: #ef4444; }
        }
    `;
    document.head.appendChild(style);

    function startExplanationProcess(code) {
        // UI State: Loading
        explainBtn.disabled = true;
        btnText.textContent = 'جاري التحليل...';
        btnIcon.className = 'fa-solid fa-spinner fa-spin';
        
        resultsSection.classList.remove('hidden');
        loadingIndicator.classList.remove('hidden');
        explanationContainer.innerHTML = '';
        summaryCard.classList.add('hidden');

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Simulate API delay for realism
        setTimeout(() => {
            generateMockExplanation(code);
        }, 1500);
    }

    function generateMockExplanation(code) {
        // Simple mock parser: break code into lines and filter empty ones
        const lines = code.split('\n').filter(line => line.trim() !== '');
        
        // Hide loading
        loadingIndicator.classList.add('hidden');
        
        // UI State: Reset button
        explainBtn.disabled = false;
        btnText.textContent = 'اشرح كود آخر';
        btnIcon.className = 'fa-solid fa-rotate-right';

        let steps = [];
        
        // Generate steps based on lines (mock logic)
        // Grouping simple lines together if there are too many, or just showing first few
        let stepCount = 0;
        
        if (lines.length > 0) {
            steps.push({
                title: 'البداية والتعريف',
                code: lines[0],
                text: getMockTextForLine(lines[0], 'start')
            });
            stepCount++;
        }
        
        if (lines.length > 2) {
            const middleLines = lines.slice(1, lines.length - 1).join('\n');
            if (middleLines.trim() !== '') {
                steps.push({
                    title: 'منطق العمليات الأساسي',
                    code: middleLines.length > 50 ? middleLines.substring(0, 50) + '...' : middleLines,
                    text: 'هنا يتم تنفيذ العمليات الرئيسية للبرنامج، مثل الشروط أو الحلقات أو الحسابات الرياضية. يقوم هذا الجزء بالمعالجة الفعلية للبيانات.'
                });
                stepCount++;
            }
        }
        
        if (lines.length > 1) {
            steps.push({
                title: 'النهاية أو الإرجاع',
                code: lines[lines.length - 1],
                text: getMockTextForLine(lines[lines.length - 1], 'end')
            });
            stepCount++;
        }

        // Display steps progressively
        displayStepsProgressively(steps, 0);
    }

    function getMockTextForLine(line, position) {
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes('function') || lowerLine.includes('def ')) {
            return 'هذا السطر يقوم بتعريف دالة (وظيفة) جديدة. الدالة هي عبارة عن مجموعة من الأوامر التي تنفذ مهمة محددة ويمكن استدعاؤها في أي وقت.';
        } else if (lowerLine.includes('import') || lowerLine.includes('#include')) {
            return 'هنا نقوم باستيراد مكتبات أو ملفات إضافية تحتوي على أكواد جاهزة لنستخدمها في برنامجنا لتسهيل العمل.';
        } else if (lowerLine.includes('for') || lowerLine.includes('while')) {
            return 'هذا السطر يبدأ حلقة تكرارية (Loop). تقوم هذه الحلقة بتكرار تنفيذ الكود الموجود بداخلها عدة مرات بناءً على شرط معين.';
        } else if (lowerLine.includes('if')) {
            return 'هذه عبارة شرطية. بمعنى آخر: "إذا تحقق هذا الشرط، قم بتنفيذ الكود التالي".';
        } else if (lowerLine.includes('return')) {
            return 'هذا السطر يحدد النتيجة النهائية التي سترجعها الدالة بعد انتهاء عملها.';
        } else if (position === 'start') {
            return 'هذا السطر يمثل نقطة البداية للكود المدخل، حيث يتم تهيئة المتغيرات أو الإعلان عن بدء العملية.';
        } else {
            return 'يمثل هذا السطر نهاية الكتل البرمجية، كإغلاق الأقواس، أو طباعة الناتج النهائي، أو إرجاع قيمة بسيطة.';
        }
    }

    function displayStepsProgressively(steps, index) {
        if (index >= steps.length) {
            // All steps displayed, show summary
            setTimeout(() => {
                summaryText.textContent = \`يتكون هذا الكود بشكل عام من \${steps.length}\` + 
                (steps.length > 2 ? ' أجزاء رئيسية.' : ' خطوات رئيسية.') + 
                ' يبدأ بتعريف المكونات، يمر بمنطق معالجة البيانات، وينتهي بإرجاع أو طباعة النتيجة المطلوبة.';
                summaryCard.classList.remove('hidden');
                
                // Scroll to summary securely
                summaryCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 600);
            return;
        }

        const step = steps[index];
        const stepHTML = \`
            <div class="step-card" style="animation-delay: \${index * 0.2}s">
                <div class="step-number">\${index + 1}</div>
                <div class="step-content">
                    <div class="step-code"><code>\${escapeHTML(step.code)}</code></div>
                    <div class="step-text">\${step.text}</div>
                </div>
            </div>
        \`;

        // Append to container
        explanationContainer.insertAdjacentHTML('beforeend', stepHTML);

        // Recursive call for next step with a delay to simulate typing/processing
        setTimeout(() => {
            displayStepsProgressively(steps, index + 1);
        }, 800); // 800ms delay between appearing steps
    }

    // Utility to prevent XSS in mock response
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
