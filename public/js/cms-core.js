document.addEventListener('DOMContentLoaded', async () => {
    // Determine the page name from the URL
    let path = window.location.pathname;
    let page = 'home';
    
    if (path.includes('nuestra-empresa.html')) page = 'empresa';
    else if (path.includes('servicios.html')) page = 'servicios';
    else if (path.includes('valor-agregado.html')) page = 'valor-agregado';
    else if (path.includes('contacto.html')) page = 'contacto';
    else if (path.includes('index.html') || path === '/' || path.endsWith('/')) page = 'home';

    try {
        const response = await fetch(`/content/${page}.json`);
        if (!response.ok) return; // Silent fail if no JSON
        
        const data = await response.json();
        
        // Flatten the JSON to allow dot notation like 'items.0.title'
        function flattenObject(ob) {
            var toReturn = {};
            for (var i in ob) {
                if (!ob.hasOwnProperty(i)) continue;
                if ((typeof ob[i]) == 'object' && ob[i] !== null) {
                    var flatObject = flattenObject(ob[i]);
                    for (var x in flatObject) {
                        if (!flatObject.hasOwnProperty(x)) continue;
                        toReturn[i + '.' + x] = flatObject[x];
                    }
                } else {
                    toReturn[i] = ob[i];
                }
            }
            return toReturn;
        }

        const flatData = flattenObject(data);

        // Update Text Elements
        document.querySelectorAll('[data-cms-text]').forEach(el => {
            const key = el.getAttribute('data-cms-text');
            if (flatData[key] !== undefined) {
                el.innerHTML = flatData[key];
            }
        });

        // Update Image Elements
        document.querySelectorAll('[data-cms-img]').forEach(el => {
            const key = el.getAttribute('data-cms-img');
            if (flatData[key] !== undefined) {
                el.src = flatData[key];
            }
        });

        // Update Background Images
        document.querySelectorAll('[data-cms-bg]').forEach(el => {
            const key = el.getAttribute('data-cms-bg');
            if (flatData[key] !== undefined) {
                el.style.backgroundImage = `url('${flatData[key]}')`;
            }
        });

        // Update Links
        document.querySelectorAll('[data-cms-link]').forEach(el => {
            const key = el.getAttribute('data-cms-link');
            if (flatData[key] !== undefined) {
                el.href = flatData[key];
            }
        });

    } catch (e) {
        console.error('CMS Hydration Error:', e);
    }
});
