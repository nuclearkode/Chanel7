import { file, write } from "bun";

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getKeyword(name: string, families: string[]): string {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("lemon")) return "lemon";
  if (lowerName.includes("orange")) return "orange";
  if (lowerName.includes("bergamot")) return "bergamot";
  if (lowerName.includes("lime")) return "lime";
  if (lowerName.includes("grapefruit")) return "grapefruit";
  if (lowerName.includes("mandarin")) return "mandarin";
  if (lowerName.includes("citrus")) return "citrus";

  if (lowerName.includes("rose")) return "rose";
  if (lowerName.includes("jasmine")) return "jasmine";
  if (lowerName.includes("lavender")) return "lavender";
  if (lowerName.includes("violet")) return "violet";
  if (lowerName.includes("iris")) return "iris";
  if (lowerName.includes("ylang")) return "ylang";
  if (lowerName.includes("tuberose")) return "tuberose";
  if (lowerName.includes("geranium")) return "geranium";
  if (lowerName.includes("neroli")) return "neroli";
  if (lowerName.includes("lily")) return "lily";
  if (lowerName.includes("magnolia")) return "magnolia";
  if (lowerName.includes("peony")) return "peony";
  if (lowerName.includes("carnation")) return "carnation";

  if (lowerName.includes("sandalwood")) return "sandalwood";
  if (lowerName.includes("cedar")) return "cedar";
  if (lowerName.includes("vetiver")) return "vetiver";
  if (lowerName.includes("patchouli")) return "patchouli";
  if (lowerName.includes("oud")) return "oud";
  if (lowerName.includes("pine")) return "pine";
  if (lowerName.includes("cypress")) return "cypress";
  if (lowerName.includes("oakmoss")) return "moss";

  if (lowerName.includes("vanilla")) return "vanilla";
  if (lowerName.includes("tonka")) return "tonka";
  if (lowerName.includes("chocolate")) return "chocolate";
  if (lowerName.includes("coffee")) return "coffee";
  if (lowerName.includes("honey")) return "honey";
  if (lowerName.includes("caramel")) return "caramel";
  if (lowerName.includes("milk")) return "milk";
  if (lowerName.includes("coconut")) return "coconut";
  if (lowerName.includes("rum")) return "rum";
  if (lowerName.includes("brandy")) return "brandy";

  if (lowerName.includes("apple")) return "apple";
  if (lowerName.includes("peach")) return "peach";
  if (lowerName.includes("pineapple")) return "pineapple";
  if (lowerName.includes("melon")) return "melon";
  if (lowerName.includes("cherry")) return "cherry";
  if (lowerName.includes("berry")) return "berry";
  if (lowerName.includes("strawberry")) return "strawberry";
  if (lowerName.includes("raspberry")) return "raspberry";
  if (lowerName.includes("plum")) return "plum";
  if (lowerName.includes("pear")) return "pear";
  if (lowerName.includes("banana")) return "banana";
  if (lowerName.includes("mango")) return "mango";
  if (lowerName.includes("grape")) return "grape";

  if (lowerName.includes("mint")) return "mint";
  if (lowerName.includes("tea")) return "tea";
  if (lowerName.includes("sage")) return "sage";
  if (lowerName.includes("basil")) return "basil";
  if (lowerName.includes("thyme")) return "thyme";
  if (lowerName.includes("rosemary")) return "rosemary";
  if (lowerName.includes("grass")) return "grass";
  if (lowerName.includes("leaf")) return "leaf";
  if (lowerName.includes("galbanum")) return "plant";

  if (lowerName.includes("cinnamon")) return "cinnamon";
  if (lowerName.includes("clove")) return "clove";
  if (lowerName.includes("pepper")) return "pepper";
  if (lowerName.includes("ginger")) return "ginger";
  if (lowerName.includes("cardamom")) return "cardamom";
  if (lowerName.includes("saffron")) return "saffron";

  if (lowerName.includes("amber")) return "amber";
  if (lowerName.includes("benzoin")) return "resin";
  if (lowerName.includes("labdanum")) return "resin";
  if (lowerName.includes("myrrh")) return "resin";
  if (lowerName.includes("olibanum")) return "incense";
  if (lowerName.includes("incense")) return "incense";

  if (lowerName.includes("musk")) return "cloud";
  if (lowerName.includes("leather")) return "leather";
  if (lowerName.includes("civet")) return "fur";
  if (lowerName.includes("castoreum")) return "fur";
  if (lowerName.includes("ambergris")) return "ocean";

  if (lowerName.includes("sea")) return "ocean";
  if (lowerName.includes("water")) return "water";
  if (lowerName.includes("salt")) return "salt";

  const familyStr = families.join(" ").toLowerCase();

  if (familyStr.includes("citrus")) return "citrus";
  if (familyStr.includes("floral")) return "flower";
  if (familyStr.includes("woody")) return "wood";
  if (familyStr.includes("green")) return "leaf";
  if (familyStr.includes("spicy")) return "spice";
  if (familyStr.includes("fruity")) return "fruit";
  if (familyStr.includes("gourmand")) return "dessert";
  if (familyStr.includes("amber")) return "amber";
  if (familyStr.includes("musk") || familyStr.includes("musky")) return "cloud";
  if (familyStr.includes("marine")) return "ocean";
  if (familyStr.includes("aquatic")) return "water";
  if (familyStr.includes("aldehydic")) return "bubble";
  if (familyStr.includes("animalic")) return "texture";
  if (familyStr.includes("earthy")) return "soil";

  return "perfume";
}

function processBuffer(buffer: string[]) {
  const hasImage = buffer.some(l => l.includes('"imageUrl":') || l.includes('imageUrl:'));
  if (hasImage) return;

  let id = "";
  let name = "";
  let families: string[] = [];

  for (const l of buffer) {
    const idMatch = l.match(/"id": "(.*?)"/);
    if (idMatch) id = idMatch[1];

    const nameMatch = l.match(/"name": "(.*?)"/);
    if (nameMatch) name = nameMatch[1];

    if (l.includes('"Floral"')) families.push("Floral");
    if (l.includes('"Woody"')) families.push("Woody");
    if (l.includes('"Citrus"')) families.push("Citrus");
    if (l.includes('"Fruity"')) families.push("Fruity");
    if (l.includes('"Spicy"')) families.push("Spicy");
    if (l.includes('"Green"')) families.push("Green");
    if (l.includes('"Gourmand"')) families.push("Gourmand");
    if (l.includes('"Aquatic"')) families.push("Aquatic");
    if (l.includes('"Amber"')) families.push("Amber");
    if (l.includes('"Musk"') || l.includes('"Musky"')) families.push("Musky");
    if (l.includes('"Animalic"')) families.push("Animalic");
    if (l.includes('"Earthy"')) families.push("Earthy");
    if (l.includes('"Marine"')) families.push("Marine");
    if (l.includes('"Aldehydic"')) families.push("Aldehydic");
  }

  if (!id || !name) return;

  const keyword = getKeyword(name, families);
  const hash = simpleHash(id);
  const imageUrl = `https://loremflickr.com/320/240/${keyword}?lock=${hash}`;

  const nameIndex = buffer.findIndex(l => l.includes(`"name": "${name}"`));
  if (nameIndex !== -1) {
    // Preserve existing indentation of the name line
    const match = buffer[nameIndex].match(/^(\s*)/);
    const indent = match ? match[1] : "    ";
    buffer.splice(nameIndex + 1, 0, `${indent}"imageUrl": "${imageUrl}",`);
    console.log(`Assigned image for ${name}: ${keyword}`);
  }
}

async function processFile() {
  const path = "src/lib/materials-data.ts";
  const content = await file(path).text();
  const lines = content.split("\n");

  let output: string[] = [];
  let buffer: string[] = [];
  let inObject = false;

  // Strict regex for top-level object boundaries (indentation level 2)
  const startObjRegex = /^  {\s*$/;
  const endObjRegex = /^  },?\s*$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (startObjRegex.test(line)) {
      if (inObject) {
        if (buffer.length > 0) {
            processBuffer(buffer);
            output = output.concat(buffer);
        }
        inObject = true;
        buffer = [line];
      } else {
        inObject = true;
        buffer = [line];
      }
    } else if (inObject) {
      buffer.push(line);

      if (endObjRegex.test(line)) {
        processBuffer(buffer);
        output = output.concat(buffer);
        buffer = [];
        inObject = false;
      }
    } else {
      output.push(line);
    }
  }

  if (inObject && buffer.length > 0) {
      processBuffer(buffer);
      output = output.concat(buffer);
  }

  await write(path, output.join("\n"));
  console.log("Updated materials data with images.");
}

processFile();
