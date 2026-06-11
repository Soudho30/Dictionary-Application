const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const displayCard = document.getElementById('display-card');
const wordVal = document.getElementById('word-val');
const phoneticVal = document.getElementById('phonetic-val');
const definitionVal = document.getElementById('definition-val');
const exampleVal = document.getElementById('example-val');
const posVal = document.getElementById('pos-val');
const audioPlayer = document.getElementById('audio-player');
const audioWrapper = document.getElementById('audio-wrapper');
const synVal = document.getElementById('syn-val');
const antVal = document.getElementById('ant-val');
const relationsRow = document.getElementById('relations-row');
const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";
async function lookupWord() {
    const targetWord = searchInput.value.trim();
    if (!targetWord) return;
    try {
        const response = await fetch(`${API_URL}${targetWord}`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        const wordData = data[0];
        displayCard.classList.remove('hidden');
        wordVal.textContent = wordData.word;
        phoneticVal.textContent = wordData.phonetic || wordData.phonetics.find(p => p.text)?.text || "none";
        const audioUrl = wordData.phonetics.find(p => p.audio && p.audio !== "")?.audio || "";
        if (audioUrl) {
            audioWrapper.classList.remove('hidden');
            audioPlayer.src = audioUrl;
        } else {
            audioWrapper.classList.add('hidden');
        }
        let allPartsOfSpeech = [];
        let combinedSyns = [];
        let combinedAnts = [];
        let chosenDefinition = "No definition found.";
        let chosenExample = "none";
        wordData.meanings.forEach((meaning, index) => {
            if(meaning.partOfSpeech) allPartsOfSpeech.push(meaning.partOfSpeech);
            if(meaning.synonyms) combinedSyns.push(...meaning.synonyms);
            if(meaning.antonyms) combinedAnts.push(...meaning.antonyms);
            if (index === 0 && meaning.definitions && meaning.definitions[0]) {
                chosenDefinition = meaning.definitions[0].definition || chosenDefinition;
                chosenExample = meaning.definitions[0].example || "none";
            }
        });
        definitionVal.textContent = chosenDefinition;
        exampleVal.textContent = chosenExample;
        posVal.textContent = allPartsOfSpeech.join(', ');
        if (combinedSyns.length > 0 || combinedAnts.length > 0) {
            relationsRow.classList.remove('hidden');
            synVal.textContent = combinedSyns.length > 0 ? combinedSyns.slice(0, 4).join(', ') : 'none';
            antVal.textContent = combinedAnts.length > 0 ? combinedAnts.slice(0, 4).join(', ') : 'none';
        } else {
            relationsRow.classList.add('hidden');
        }
    } catch (err) {
        displayCard.classList.remove('hidden');
        displayCard.innerHTML = `<p class="error-text">Word not found. Try another word.</p>`;
    }
}
searchBtn.addEventListener('click', lookupWord);
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') lookupWord();
});