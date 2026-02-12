const fs = require('fs');
const path = require('path');

const inputFile = './PerFume- For inspiration only/Two Gits/perfumenuke-main/data/materials.json';
const outputFile = 'src/lib/materials-data.ts';

try {
    const rawData = fs.readFileSync(inputFile, 'utf8');
    const data = JSON.parse(rawData);

    // ... (rest of logic) ...
    // Since I can't pipe large content easily in one go, I'll simplify the script writing.
    // I'll just write the minimal script logic here.

    const ingredients = data.materials.map(m => {
        let note = 'Mid';
        if (m.note) {
             const n = m.note.toUpperCase();
             if (n === 'TOP') note = 'Top';
             else if (n === 'BASE') note = 'Base';
        }

        let families = ['Floral']; // Default
        if (m.tags && Array.isArray(m.tags)) {
             families = m.tags.map(t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
        }

        let conc = 100;
        if (m.dilute) {
             const match = m.dilute.match(/(\d+(\.\d+)?)%/);
             if (match) conc = parseFloat(match[1]);
        }

        return {
            id: m.id || 'unknown_' + Math.random().toString(36).substr(2, 9),
            name: m.name || 'Unknown',
            vendor: m.company || 'Generic',
            cost: 0.5,
            note: note,
            olfactiveFamilies: families,
            isAllergen: m.ifra_restricted || false,
            ifraLimit: (m.max_in_finished_product ? m.max_in_finished_product * 100 : (m.max_in_concentrate ? m.max_in_concentrate * 100 : 100)),
            casNumber: m.cas !== 'N/A' ? m.cas : undefined,
            description: m.usage || m.scent || '',
            longevity: parseFloat(m.longevity) || 4,
            impact: parseFloat(m.impact) || 50,
            concentration: conc,
            dilution: conc,
        };
    });

    const fileContent = `import { Ingredient } from './types';

export const importedMaterials: Ingredient[] = ${JSON.stringify(ingredients, null, 2)};
`;

    fs.writeFileSync(outputFile, fileContent);
    console.log('Converted ' + ingredients.length + ' materials.');

} catch (err) {
    console.error('Error:', err);
}
