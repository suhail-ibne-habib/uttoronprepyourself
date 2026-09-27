function html(strings) {
  return strings
    .trim()
    .replace(/\n\s*\n/g, "</p><p>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>")
    .replace(/<p><\/p>/g, "");
}

export const ntrcaEnglishLessons = [
  {
    title: "Noun",
    slug: "noun",
    aliases: ["nouns", "naming word"],
    order: 10,
    summary: "A noun names a person, place, thing, idea or quality. NTRCA items test type, number and article use.",
    body: `
<h2>What is a noun?</h2>
<p>A <strong>noun</strong> is a naming word. It names a person (teacher), a place (Dhaka), a thing (book), or an idea/quality (honesty, motherhood).</p>
<p>In NTRCA English, you are rarely asked only “which word is a noun”. You are asked how that noun behaves with <strong>articles</strong>, <strong>number</strong> (singular/plural) and <strong>meaning</strong> (concrete vs abstract).</p>
<h3>Main classes tested in NTRCA</h3>
<ul>
<li><strong>Common noun</strong> — a general name: mother, city, teacher</li>
<li><strong>Proper noun</strong> — a particular name: Bangladesh, Quran, Shakespeare</li>
<li><strong>Abstract noun</strong> — a quality or idea: beauty, childhood, honesty</li>
<li><strong>Collective noun</strong> — a group as one: team, jury, flock</li>
<li><strong>Material noun</strong> — substance: gold, milk, water</li>
</ul>
<h3>Exam habit</h3>
<p>Read the sentence twice. Ask: is the noun pointing to a <em>real person/thing</em>, or to a <em>quality/feeling</em>? That one question decides many article items.</p>
`,
    children: [
      {
        title: "Common noun",
        slug: "common-noun",
        aliases: ["common nouns", "common noun"],
        order: 11,
        summary: "A general name for a person, place or thing. With a changed meaning it can take the like an abstract idea.",
        body: `
<h2>Common noun</h2>
<p>A <strong>common noun</strong> is the ordinary name of a class. It does not point to one unique person or place.</p>
<ul>
<li>Person: mother, father, teacher, student</li>
<li>Place: village, school, river, market</li>
<li>Thing: book, chair, mobile, tree</li>
</ul>
<p>Common nouns are usually written with a <strong>small letter</strong>, unless they begin a sentence.</p>
<h3>When a common noun needs no article</h3>
<p>When you mean a specific relative or person as if it were a name, English often drops the article:</p>
<ul>
<li><em>Mother is calling.</em> (your own mother, used like a name)</li>
<li><em>Father has gone to market.</em></li>
</ul>
<p>This is why “Mother rose in her” is <strong>not</strong> the usual exam key. That reading treats <em>mother</em> as a family member standing up.</p>
<h3>When a common noun becomes an idea</h3>
<p>The same word can name a <strong>quality or feeling</strong>. Then it works like an <strong>abstract noun</strong> and NTRCA almost always wants the definite article <strong>the</strong>:</p>
<ul>
<li><em>The mother in her woke up.</em> = maternal feeling / motherhood</li>
<li><em>The poet in him is dead.</em> = poetic nature</li>
<li><em>The child in us never dies.</em> = childlike quality</li>
</ul>
<p>NTRCA favourite pattern:</p>
<blockquote>The + common noun + in + possessive + verb</blockquote>
<p><strong>The mother rose in her</strong> means motherhood / motherly affection awoke inside her. It does not mean a woman physically stood up.</p>
<h3>Why the other options fail</h3>
<ul>
<li><strong>A mother rose in her</strong> — <em>a/an</em> names one unknown person. It sounds as if a mother entered her body.</li>
<li><strong>Mother rose in her</strong> — zero article names a family member. The sentence then means a person stood up, which is not the intended figurative sense.</li>
</ul>
<h3>Quick test</h3>
<p>If you can replace the noun with a quality word (affection, courage, poetical gift) and the sentence still makes sense, use <strong>the</strong>.</p>
`,
      },
      {
        title: "Proper noun",
        slug: "proper-noun",
        aliases: ["proper nouns"],
        order: 12,
        summary: "The particular name of a person, place or work. It takes a capital letter and usually no article.",
        body: `
<h2>Proper noun</h2>
<p>A <strong>proper noun</strong> names one particular person, place, day, language or work: <em>Karim, Dhaka, Friday, Bangla, the Quran</em>.</p>
<p>Write it with a <strong>capital letter</strong>. Do not use <em>a/an</em> before a unique proper name: not “a Dhaka”, not “a Bangladesh”.</p>
<h3>When the is used</h3>
<ul>
<li>Rivers, seas, holy books and some newspapers: <em>the Padma, the Quran, the Ittefaq</em></li>
<li>Plural or descriptive names: <em>the United States, the Netherlands</em></li>
</ul>
<p>NTRCA often contrasts proper vs common: <em>the Padma</em> (river, unique) vs <em>a river</em> (any river).</p>
`,
      },
      {
        title: "Abstract noun",
        slug: "abstract-noun",
        aliases: ["abstract nouns", "abstract"],
        order: 13,
        summary: "Names a quality, state, feeling or idea that you cannot touch.",
        body: `
<h2>Abstract noun</h2>
<p>An <strong>abstract noun</strong> names something you cannot see or touch: <em>honesty, childhood, beauty, poverty, anger, motherhood</em>.</p>
<p>Many abstract nouns are formed from adjectives or verbs: kind → kindness, young → youth, decide → decision.</p>
<h3>Article use</h3>
<p>When the quality is spoken of in a general sense, English often uses no article: <em>Honesty is the best policy.</em></p>
<p>When the quality is limited to a person or a situation, NTRCA prefers <strong>the</strong>: <em>The honesty of the boy surprised us.</em> The same logic turns a common noun into an abstract idea: <em>The mother in her</em>.</p>
`,
      },
      {
        title: "Collective noun",
        slug: "collective-noun",
        aliases: ["collective nouns"],
        order: 14,
        summary: "Names a group of people or things as one unit.",
        body: `
<h2>Collective noun</h2>
<p>A <strong>collective noun</strong> names a group treated as one: <em>class, team, jury, committee, flock, crowd</em>.</p>
<h3>Verb agreement (NTRCA favourite)</h3>
<ul>
<li>The group as one unit → singular: <em>The team is strong.</em></li>
<li>The members acting separately → plural (more common in British/board English): <em>The jury were divided in their opinion.</em></li>
</ul>
<p>Look at the meaning, not only the form.</p>
`,
      },
    ],
  },
  {
    title: "Article",
    slug: "article",
    aliases: ["articles"],
    order: 20,
    summary: "A, an and the. NTRCA tests a/an before sounds, and the when a common noun is used as an idea.",
    body: `
<h2>Articles</h2>
<p>English has two kinds of article:</p>
<ul>
<li><strong>Indefinite</strong>: <em>a</em>, <em>an</em> — one of a class, not specified</li>
<li><strong>Definite</strong>: <em>the</em> — a particular one, or a quality already identified by the sense of the sentence</li>
</ul>
<p>There is also <strong>zero article</strong> (no article) with names, uncountable nouns in a general sense, and family titles used as names.</p>
`,
    children: [
      {
        title: "Definite article",
        slug: "definite-article",
        aliases: ["the", "definite articles"],
        order: 21,
        summary: "The points to a particular noun, a unique thing, or a quality taken from a common noun.",
        body: `
<h2>The (definite article)</h2>
<p>Use <strong>the</strong> when the hearer can tell which one you mean.</p>
<ul>
<li>Already mentioned: <em>I bought a pen. The pen is blue.</em></li>
<li>Unique in the context: <em>the sun, the principal, the Quran</em></li>
<li>Superative / ordinal: <em>the best boy, the first day</em></li>
<li>A common noun used as a quality: <em>The mother rose in her.</em></li>
</ul>
<p>Board exams love the last rule. If the noun is a feeling or role inside a person, write <strong>the + noun + in + possessive</strong>.</p>
`,
      },
      {
        title: "Indefinite article",
        slug: "indefinite-article",
        aliases: ["a", "an", "indefinite articles"],
        order: 22,
        summary: "A and an mean one of a class. Choose an before a vowel sound, not only a vowel letter.",
        body: `
<h2>A / An</h2>
<p><strong>A</strong> and <strong>an</strong> mean “one, not a particular one”.</p>
<ul>
<li>a book, a university (yu- sound), a European</li>
<li>an apple, an hour (silent h), an MBA, an honest man</li>
</ul>
<p>The choice depends on <strong>sound</strong>, not spelling. <em>University</em> begins with a consonant sound, so it takes <em>a</em>.</p>
<p>Do not use a/an when the noun is used as an inner quality. <em>A mother rose in her</em> is wrong in that figurative NTRCA item.</p>
`,
      },
      {
        title: "Zero article",
        slug: "zero-article",
        aliases: ["no article", "omission of article"],
        order: 23,
        summary: "No article before names, general uncountables, and family words used as names.",
        body: `
<h2>Zero article</h2>
<p>English often uses <strong>no article</strong>:</p>
<ul>
<li>Proper names: <em>Karim lives in Dhaka.</em></li>
<li>Family words as names: <em>Mother is in the kitchen.</em></li>
<li>Uncountable / abstract in a general sense: <em>Water is life. Honesty is rare.</em></li>
<li>Plural common nouns in a general sense: <em>Teachers shape a nation.</em></li>
</ul>
<p>Zero article is not automatic. If the same family word means a feeling, NTRCA wants <em>the</em>: <em>The father in him protested.</em></p>
`,
      },
    ],
  },
  {
    title: "Pronoun",
    slug: "pronoun",
    aliases: ["pronouns"],
    order: 30,
    summary: "A word used instead of a noun. Watch case (I/me) and agreement.",
    body: `
<h2>Pronoun</h2>
<p>A <strong>pronoun</strong> stands in place of a noun: <em>he, she, it, they, who, myself</em>.</p>
<h3>Frequent NTRCA points</h3>
<ul>
<li>Case: <em>It is I</em> (formal key in many board books) vs informal <em>It's me</em>.</li>
<li>After a preposition use object form: <em>between you and me</em>.</li>
<li>Reflexive: <em>He hurt himself</em>, not <em>hisself</em>.</li>
<li>Relative: <em>who</em> for persons, <em>which</em> for things, <em>that</em> for both in defining clauses.</li>
</ul>
`,
  },
  {
    title: "Adjective",
    slug: "adjective",
    aliases: ["adjectives"],
    order: 40,
    summary: "Describes a noun or pronoun. Learn order, comparison and articles with superlatives.",
    body: `
<h2>Adjective</h2>
<p>An <strong>adjective</strong> qualifies a noun or pronoun: <em>a red rose, she is honest</em>.</p>
<ul>
<li>Comparative: two units — <em>taller than</em></li>
<li>Superlative: more than two — <em>the tallest</em> (use <em>the</em>)</li>
<li>Some adjectives have irregular forms: good / better / best</li>
</ul>
<p>Do not use double comparison: not <em>more better</em>.</p>
`,
  },
  {
    title: "Verb and tense",
    slug: "verb-and-tense",
    aliases: ["verb", "verbs", "tense", "tenses"],
    order: 50,
    summary: "Tense shows time. NTRCA mixes form (have been) with time words (since, for, ago).",
    body: `
<h2>Verb and tense</h2>
<p>A <strong>verb</strong> says what the subject does or is. <strong>Tense</strong> places that action in time.</p>
<h3>High-yield contrasts</h3>
<ul>
<li><em>since</em> + point of time; <em>for</em> + period: <em>since 2015 / for ten years</em></li>
<li>Present perfect + since/for: <em>He has lived here since 2010.</em></li>
<li>Past simple + ago: <em>He came here five years ago.</em></li>
<li>Conditionals: <em>If he comes, I will go.</em> / <em>If he had come, I would have gone.</em></li>
</ul>
`,
    children: [
      {
        title: "Right form of verbs",
        slug: "right-form-of-verbs",
        aliases: [
          "right forms of verbs",
          "right form of verb",
          "correct form of verbs",
          "correct forms of verbs",
        ],
        order: 52,
        summary: "Pick the verb form that fits tense, subject and the time word in the sentence.",
        body: `
<h2>Right form of verbs</h2>
<p>NTRCA often gives a sentence with a blank and four verb forms. Read the <strong>time word</strong> first, then the subject.</p>
<ul>
<li>ago → past simple: <em>He came here five years ago.</em></li>
<li>since / for + unfinished time → present perfect: <em>He has lived here since 2010.</em></li>
<li>now / at present → present continuous: <em>She is reading now.</em></li>
<li>always / usually → present simple: <em>He goes to school every day.</em></li>
</ul>
<p>Do not mix two tenses in one clause unless the meaning needs it.</p>
`,
      },
      {
        title: "Subject-verb agreement",
        slug: "subject-verb-agreement",
        aliases: ["agreement", "concord"],
        order: 51,
        summary: "The verb follows the real subject, not the nearest noun.",
        body: `
<h2>Subject-verb agreement</h2>
<p>A singular subject takes a singular verb: <em>The quality of the mangoes is good.</em> The head noun is <em>quality</em>, not <em>mangoes</em>.</p>
<ul>
<li>Each, every, either, neither → singular</li>
<li>Neither A nor B → verb agrees with B</li>
<li>A number of → plural; the number of → singular</li>
</ul>
`,
      },
    ],
  },
  {
    title: "Voice",
    slug: "voice",
    aliases: ["active voice", "passive voice"],
    order: 60,
    summary: "Active vs passive. Keep tense; change only the object-subject relation.",
    body: `
<h2>Voice</h2>
<p><strong>Active</strong>: the subject does the action. <em>The teacher praised the boy.</em></p>
<p><strong>Passive</strong>: the object becomes the subject. <em>The boy was praised by the teacher.</em></p>
<p>Never change the tense family. Present simple → <em>is/are + past participle</em>. Present perfect → <em>has/have been + past participle</em>.</p>
<p>Intransitive verbs (sleep, go) have no object, so they usually have no passive.</p>
`,
  },
  {
    title: "Narration",
    slug: "narration",
    aliases: ["direct speech", "indirect speech", "reported speech"],
    order: 70,
    summary: "Direct to indirect speech. Shift tense, person and time words together.",
    body: `
<h2>Narration</h2>
<p><strong>Direct</strong>: He said, “I am ready.”</p>
<p><strong>Indirect</strong>: He said that he was ready.</p>
<h3>Usual shifts after a past reporting verb</h3>
<ul>
<li>am/is → was; are → were</li>
<li>have → had; will → would; can → could</li>
<li>today → that day; tomorrow → the next day; here → there</li>
</ul>
<p>If the reporting verb is present, tenses often stay: <em>He says that he is ready.</em></p>
`,
  },
  {
    title: "Preposition",
    slug: "preposition",
    aliases: ["prepositions"],
    order: 80,
    summary: "A short word that shows relation. Learn fixed pairs more than translations.",
    body: `
<h2>Preposition</h2>
<p>A <strong>preposition</strong> links a noun/pronoun to another word: <em>in, on, at, of, for, since, by, with</em>.</p>
<ul>
<li>Time: at 5 pm, on Friday, in 2024</li>
<li>Place: at school (institution), in the room, on the table</li>
<li>Fixed: interested <em>in</em>, afraid <em>of</em>, good <em>at</em>, married <em>to</em></li>
</ul>
<p>Do not translate from Bangla word-for-word. Learn the pair.</p>
`,
  },
  {
    title: "Idioms and phrases",
    slug: "idioms-and-phrases",
    aliases: ["idioms", "idiom", "phrases", "idiomatic phrases", "Idioms & Phrases"],
    order: 85,
    summary: "A fixed group of words whose meaning is not the sum of the words. NTRCA asks the nearest meaning.",
    body: `
<h2>Idioms and phrases</h2>
<p>An <strong>idiom</strong> is a fixed expression. You cannot guess it word by word.</p>
<ul>
<li><em>at a stretch</em> — continuously, without a break</li>
<li><em>in a nutshell</em> — in a few words; briefly</li>
<li><em>to look down upon</em> — to despise</li>
<li><em>to call a spade a spade</em> — to speak plainly</li>
<li><em>a red-letter day</em> — a memorable / important day</li>
</ul>
<p>Choose the option closest in meaning. Do not pick a literal picture of the words.</p>
`,
  },
  {
    title: "Conjunction",
    slug: "conjunction",
    aliases: ["conjunctions"],
    order: 90,
    summary: "Joins words or clauses. Either/or, neither/nor and although/but are frequent traps.",
    body: `
<h2>Conjunction</h2>
<p>A <strong>conjunction</strong> joins words, phrases or clauses: <em>and, but, or, because, although, if</em>.</p>
<ul>
<li>Do not pair <em>although</em> with <em>but</em>.</li>
<li>Either … or / neither … nor must stay in balance.</li>
<li>Both … and takes a plural verb: <em>Both Rina and Mina are present.</em></li>
</ul>
`,
  },
];

void html;
