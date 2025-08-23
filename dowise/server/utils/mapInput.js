// server/utils/mapInput.js
const Template = require("../models/Template");

const alias = {
  Frontend: ["frontend","front end","ui","websites","web dev","react","html","css","javascript","web","ui/ux","user interface","user experience","design","visual","creative","art","drawing","painting","graphics","photoshop","illustrator","figma","sketch"],
  Backend: ["backend","back end","api","server","node","express","database","crud","server","database","sql","mongodb","mysql","postgresql","architecture","system design","microservices","apis","rest","graphql","performance","scalability"],
  DSA: ["dsa","data structures","algorithms","coding interview","leetcode","gfg","competitive","programming","coding","computer science","math","mathematics","logic","problem solving","brain teasers","puzzles","optimization","efficiency","complexity","big o"],
  AI: ["ai","machine learning","ml","data science","sklearn","pandas","numpy","artificial intelligence","deep learning","neural networks","computer vision","nlp","natural language processing","robotics","automation","predictive analytics","statistics","probability","data analysis","data visualization","tableau","powerbi"],
  DevOps: ["devops","docker","kubernetes","ci cd","cicd","linux","cloud","aws","azure","gcp","google cloud","infrastructure","deployment","monitoring","logging","security","networking","system administration","linux","unix","shell scripting","bash","python","automation","terraform","ansible","jenkins","gitlab","github actions"],
  Mobile: ["mobile","android","ios","react native","flutter","swift","kotlin","java","app development","smartphone","tablet","cross platform","hybrid","native","mobile ui","touch interface","gestures","mobile design"],
  Business: ["business","entrepreneurship","startup","marketing","sales","finance","accounting","economics","management","leadership","strategy","planning","project management","agile","scrum","kanban","product management","customer service","negotiation","public speaking"],
  Language: ["language","english","spanish","french","german","chinese","japanese","korean","russian","arabic","hindi","learning","grammar","vocabulary","pronunciation","conversation","writing","reading","listening","speaking","translation","interpretation"],
  Music: ["music","guitar","piano","violin","drums","singing","vocal","composition","theory","rhythm","melody","harmony","production","recording","mixing","mastering","instruments","band","orchestra","classical","jazz","rock","pop","electronic"],
  Fitness: ["fitness","health","exercise","workout","gym","strength training","cardio","yoga","meditation","nutrition","diet","weight loss","muscle building","flexibility","endurance","sports","running","swimming","cycling","martial arts","boxing","karate"],
  Cooking: ["cooking","baking","culinary","chef","recipes","food","kitchen","cuisine","ingredients","techniques","knife skills","sauces","desserts","bread","pastry","grilling","roasting","frying","steaming","meal planning","nutrition","dietary restrictions"],
  Photography: ["photography","camera","photo","images","composition","lighting","editing","photoshop","lightroom","portrait","landscape","street","wildlife","macro","black and white","color theory","aperture","shutter speed","iso","focus","depth of field"],
  Writing: ["writing","creative writing","novel","poetry","essay","blog","content","copywriting","journalism","storytelling","narrative","character development","plot","dialogue","description","editing","proofreading","publishing","self publishing","amazon kindle"],
  Science: ["science","physics","chemistry","biology","astronomy","geology","environmental","research","experiments","hypothesis","theory","scientific method","laboratory","microscope","telescope","data collection","analysis","conclusions","peer review","publications"]
};

async function loadTemplateNames() {
  const list = await Template.find({}, "name").lean();
  return list.map(t => t.name);
}

async function mapInputToCategories(text) {
  const t = text.toLowerCase();
  const names = await loadTemplateNames();
  const hits = [];
  
  // First, try exact matches with aliases
  for (const name of names) {
    const keys = alias[name] || [];
    if (keys.some(k => t.includes(k)) || t.includes(name.toLowerCase())) {
      hits.push(name);
    }
  }
  
  // If no exact matches, try partial matches and semantic similarity
  if (!hits.length) {
    // Check for common learning patterns
    if (t.includes("learn") || t.includes("study") || t.includes("master")) {
      // Extract the subject from "learn X" or "study Y"
      const subject = t.replace(/(learn|study|master|get good at|become expert in)/g, '').trim();
      
      // Try to match the subject with available templates
      for (const name of names) {
        const keys = alias[name] || [];
        if (keys.some(k => subject.includes(k) || k.includes(subject))) {
          hits.push(name);
        }
      }
    }
    
    // Check for specific skills or interests
    if (t.includes("guitar") || t.includes("piano") || t.includes("music")) hits.push("Music");
    if (t.includes("cook") || t.includes("bake") || t.includes("food")) hits.push("Cooking");
    if (t.includes("photo") || t.includes("camera") || t.includes("picture")) hits.push("Photography");
    if (t.includes("write") || t.includes("novel") || t.includes("story")) hits.push("Writing");
    if (t.includes("science") || t.includes("research") || t.includes("experiment")) hits.push("Science");
    if (t.includes("business") || t.includes("startup") || t.includes("entrepreneur")) hits.push("Business");
    if (t.includes("fitness") || t.includes("workout") || t.includes("gym")) hits.push("Fitness");
    if (t.includes("language") || t.includes("spanish") || t.includes("french")) hits.push("Language");
    if (t.includes("mobile") || t.includes("app") || t.includes("android")) hits.push("Mobile");
    if (t.includes("fullstack") || t.includes("full stack")) {
      if (names.includes("Frontend")) hits.push("Frontend");
      if (names.includes("Backend")) hits.push("Backend");
    }
  }
  
  // If still no matches, try to infer from context
  if (!hits.length) {
    if (t.includes("code") || t.includes("programming") || t.includes("software")) {
      if (names.includes("Frontend")) hits.push("Frontend");
      if (names.includes("Backend")) hits.push("Backend");
    }
    if (t.includes("math") || t.includes("algorithm") || t.includes("problem")) hits.push("DSA");
    if (t.includes("data") || t.includes("statistics") || t.includes("analysis")) hits.push("AI");
    if (t.includes("server") || t.includes("deploy") || t.includes("cloud")) hits.push("DevOps");
  }
  
  // Return matched templates or a diverse selection if nothing matched
  if (hits.length) {
    return hits;
  } else if (names.length >= 3) {
    // Return a diverse selection of templates
    return [names[0], names[Math.floor(names.length/2)], names[names.length-1]];
  } else {
    return names.length ? [names[0]] : ["Frontend"];
  }
}

module.exports = { mapInputToCategories };
