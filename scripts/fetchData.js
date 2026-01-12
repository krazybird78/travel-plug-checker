import fs from 'fs';
import https from 'https';

const URL = 'https://raw.githubusercontent.com/benjiao/world-plugs/master/world-plugs.csv';

https.get(URL, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        const lines = data.split('\n').filter(line => line.trim() !== '');
        const countries = {};

        // Skip header
        for (let i = 1; i < lines.length; i++) {
            // Fix for lines with comma in quotes like "110 V, 220 V"
            const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];

            // Expected indices based on header: ,country_code,frequency,name,plug_type,voltage
            // My regex/split might vary, let's try a simpler split and manual fix for quotes

            // Simple split for now, assuming the comma in quotes is the only issue
            let cells = [];
            let inQuotes = false;
            let currentCell = '';
            for (let char of lines[i]) {
                if (char === '"') inQuotes = !inQuotes;
                else if (char === ',' && !inQuotes) {
                    cells.push(currentCell.trim());
                    currentCell = '';
                } else {
                    currentCell += char;
                }
            }
            cells.push(currentCell.trim());

            // cells[1]: country_code, cells[2]: frequency, cells[3]: name, cells[4]: plug_type, cells[5]: voltage
            const code = cells[1];
            const frequency = cells[2];
            const name = cells[3];
            const plugType = cells[4]?.replace('Type ', '');
            const voltage = cells[5];

            if (!name) continue;

            if (!countries[name]) {
                countries[name] = {
                    name,
                    code,
                    frequencies: new Set(),
                    plugs: new Set(),
                    voltages: new Set()
                };
            }

            if (frequency) countries[name].frequencies.add(frequency);
            if (plugType) countries[name].plugs.add(plugType);
            if (voltage) countries[name].voltages.add(voltage);
        }

        const result = Object.values(countries).map(c => ({
            name: c.name,
            code: c.code,
            frequencies: Array.from(c.frequencies),
            plugs: Array.from(c.plugs),
            voltages: Array.from(c.voltages)
        })).sort((a, b) => a.name.localeCompare(b.name));

        if (!fs.existsSync('./src/data')) {
            fs.mkdirSync('./src/data', { recursive: true });
        }

        fs.writeFileSync('./src/data/countries.json', JSON.stringify(result, null, 2));
        console.log(`Successfully generated data for ${result.length} countries.`);
    });
}).on('error', (err) => {
    console.error('Error fetching data:', err.message);
});
