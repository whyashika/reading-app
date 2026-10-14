/**
 * ─────────────────────────────────────────────────────────────
 *  ALL READING CONTENT LIVES IN THIS FILE.
 * ─────────────────────────────────────────────────────────────
 *  Every piece below is a PLACEHOLDER (see `placeholder: true`).
 *  Replace them with real pieces; the feed, subject filters and
 *  the metro map all update automatically. See README.md →
 *  "Adding or editing a piece" for a field-by-field guide.
 * ─────────────────────────────────────────────────────────────
 */
import type { Piece } from "./types";

export const pieces: Piece[] = [
  // ── 1 ─────────────────────────────────────────────────────
  {
    id: "compound-interest",
    title: "The Snowball in Your Savings Account",
    subject: ["Finance"],
    format: "Explainer",
    blurb:
      "Why a small amount saved early can quietly outgrow a big amount saved late, explained with a snowball and a lot of patience.",
    themes: ["Saving", "Time", "Growth"],
    difficulty: 1,
    realWorldHook: {
      text: "Every savings account, pension and loan you'll ever have runs on this one idea.",
      type: "Evergreen",
    },
    keyTerms: ["compound interest", "interest rate", "saving", "time value of money"],
    publishedDate: "2026-07-02",
    placeholder: true,
    body: `I used to think interest was a reward you got once, like a thank-you note from the bank. It isn't. It's more like a snowball rolling downhill: the bigger it gets, the more snow it picks up on each turn.

Here's the whole trick. Say you put **₹10,000** in an account that pays 8% a year. After year one you have ₹10,800. In year two, the bank pays 8% not on your original ₹10,000 but on ₹10,800. That extra ₹64 looks tiny. But it is interest *earning its own interest*, and that is what "compound" means.

Give it enough time and the curve bends upward. Left alone for 30 years, that ₹10,000 becomes roughly ₹1,00,000. Nothing dramatic happened in any single year. The magic was entirely in the waiting.

> The most important number in compounding isn't the interest rate. It's the number of years.

The same snowball rolls the other way on debt. A credit-card balance you ignore compounds too, which is why "minimum payment" plans can stretch on for what feels like forever. Same physics, opposite hill.`,
    checkIn: {
      question: "What makes compound interest different from a one-off reward?",
      options: [
        {
          text: "Interest is paid on your past interest as well as your original money",
          isCorrect: true,
          explanation:
            "Exactly. Each year's interest joins the pile, so next year's interest is calculated on a bigger pile. That's the snowball.",
        },
        {
          text: "The interest rate goes up every year you stay",
          isCorrect: false,
          explanation:
            "Easy to assume, but the rate in our example stays at 8%. The growth speeds up because the amount it's applied to keeps growing.",
        },
        {
          text: "It only works with very large amounts of money",
          isCorrect: false,
          explanation:
            "Happily not. Our example starts with ₹10,000. Time matters far more than the starting amount.",
        },
      ],
    },
  },

  // ── 2 ─────────────────────────────────────────────────────
  {
    id: "inflation-chai",
    title: "Why Your Chai Costs More Every Year",
    subject: ["Economics"],
    format: "Explainer",
    blurb:
      "Inflation, told through one cup of tea: what it is, why a little of it is considered healthy, and why a lot of it hurts.",
    themes: ["Prices", "Everyday economics", "Money"],
    difficulty: 1,
    series: { name: "The Price of Everything", part: 1, totalParts: 2 },
    realWorldHook: {
      text: "Notice the price of your usual order creeping up? That's this piece, happening to you.",
      type: "Evergreen",
    },
    keyTerms: ["inflation", "prices", "purchasing power", "money supply"],
    publishedDate: "2026-07-09",
    placeholder: true,
    body: `There's a chai stall near my old college that charged ₹10 a cup when I started. By the time I left it was ₹15. The tea hadn't changed. The cup hadn't changed. What changed was the value of the money I was paying with.

That slow drift is **inflation**: the general rise in prices across an economy, which is the same thing as each rupee buying a little less. Economists call what a rupee can buy its *purchasing power*, and inflation is purchasing power leaking away.

Why does it happen? Sometimes costs go up: milk, sugar, rent and the stall-owner's gas cylinder all get pricier, and she passes that on. Sometimes there's simply more money chasing the same amount of chai, so sellers can charge more and still sell out.

Here's the part that surprised me: most central banks actually *want* a little inflation, around 2–4% a year. Gently rising prices nudge people to spend and invest rather than hoard cash. It's runaway inflation, prices doubling in months, that wrecks savings and makes planning impossible.

So the extra five rupees isn't a scam. It's a tiny window into the whole economy, served in a paper cup.`,
    checkIn: {
      question: "If inflation is 5% this year, what has happened to your ₹100 note?",
      options: [
        {
          text: "It buys roughly 5% less than it did a year ago",
          isCorrect: true,
          explanation:
            "Yes. The note still says ₹100, but its purchasing power has shrunk, so the same basket of things now costs about ₹105.",
        },
        {
          text: "It's now worth ₹95 at the bank",
          isCorrect: false,
          explanation:
            "Close in spirit! The bank will still call it ₹100. What changes is what it can buy, not the number printed on it.",
        },
        {
          text: "Nothing, unless you spend it",
          isCorrect: false,
          explanation:
            "A very natural thought, but inflation works on money even while it sits in your drawer. That's why people talk about savings 'losing value'.",
        },
      ],
    },
  },

  // ── 3 ─────────────────────────────────────────────────────
  {
    id: "interest-rate-hikes",
    title: "Why Central Banks Raise Interest Rates to Cool Prices",
    subject: ["Economics", "Finance"],
    format: "News breakdown",
    blurb:
      "When the news says 'the central bank raised rates', here's the chain reaction it's hoping for, from your EMI to the price of chai.",
    themes: ["Central banks", "Borrowing", "Inflation"],
    difficulty: 3,
    readThisFirst: ["inflation-chai", "compound-interest"],
    series: { name: "The Price of Everything", part: 2, totalParts: 2 },
    realWorldHook: {
      text: "Placeholder hook: written around a recent central bank rate decision. Swap in the real headline.",
      type: "Timely",
    },
    keyTerms: ["interest rate", "inflation", "central bank", "monetary policy", "loans"],
    publishedDate: "2026-09-18",
    placeholder: true,
    body: `In Part 1 we watched the price of chai rise. Now the headline: *"Central bank raises interest rates."* What does a bank in a faraway building have to do with my tea?

Think of interest as the **price of borrowing money**. When the central bank raises its key rate, ordinary banks have to pay more to borrow, so they charge you more too. Home loans, car loans and business loans all get pricier.

Now follow the dominoes. Borrowing costs more, so people and companies borrow and spend a bit less. Shops find fewer customers lining up, so they can't raise prices as easily. Slowly, the pressure that was pushing prices up eases off. Meanwhile, savings accounts start paying a little more, which makes keeping money (and letting it compound) more tempting than spending it.

## The catch

It's a blunt tool. Cool the economy too much and businesses hire fewer people. That's why every rate decision is a balancing act, and why economists argue about it so loudly. The central bank is trying to turn down the heat without putting out the stove.

So when you see that headline, read it as: *"We think prices are rising too fast, and we're willing to make borrowing more expensive to slow things down."*`,
    checkIn: {
      question: "How is a rate hike supposed to slow inflation?",
      options: [
        {
          text: "By making borrowing pricier, so people and firms spend less and price pressure eases",
          isCorrect: true,
          explanation:
            "That's the chain. Less borrowing means less spending, which gives sellers less room to keep raising prices.",
        },
        {
          text: "By ordering shops to lower their prices",
          isCorrect: false,
          explanation:
            "It can feel that direct, but central banks don't set shop prices. They nudge prices indirectly through the cost of money.",
        },
        {
          text: "By printing more money so everyone can afford things",
          isCorrect: false,
          explanation:
            "Good guess at a fix, but more money chasing the same goods usually pushes prices up, the opposite of the goal.",
        },
      ],
    },
  },

  // ── 4 ─────────────────────────────────────────────────────
  {
    id: "carbon-credits",
    title: "Can You Buy Your Way Out of Pollution?",
    subject: ["Finance", "Sustainability"],
    format: "News breakdown",
    blurb:
      "Carbon credits turn pollution into something you can trade. A look at how that's meant to work, and why critics are suspicious.",
    themes: ["Climate", "Markets", "Accountability"],
    difficulty: 2,
    readThisFirst: ["village-pond"],
    realWorldHook: {
      text: "Placeholder hook: tied to recent reporting on airline 'carbon-neutral flight' claims.",
      type: "Timely",
    },
    keyTerms: ["carbon credits", "emissions", "markets", "externalities", "climate"],
    publishedDate: "2026-08-21",
    placeholder: true,
    body: `When I booked a flight last year, the website offered to make my trip "carbon neutral" for a few hundred rupees. I clicked yes, felt virtuous for about four seconds, and then wondered: *what did I just buy?*

The answer is a **carbon credit**. One credit usually represents one tonne of carbon dioxide that was kept out of the air (say, by protecting a forest) or pulled out of it. The idea is that pollution has a cost nobody was paying. Credits put a price tag on it.

There are two big flavours. In a *compliance* market, the government caps how much companies may emit and hands out or sells permits; companies that pollute less can sell their spare permits to those that pollute more. In a *voluntary* market, companies (and flyers like me) buy credits by choice to "offset" emissions.

The worry is in that second kind. Would that forest have been cut down anyway? Will it still be standing in twenty years? If the answer is shaky, the credit is a promise with nothing behind it. Journalists have found projects where that seemed to be the case.

So the honest answer is: you can buy *part* of your way out, if the credit is real. The idea is clever finance. The hard part, as with the village pond, is making sure everyone keeps their word.`,
    checkIn: {
      question: "What is one carbon credit usually meant to represent?",
      options: [
        {
          text: "One tonne of CO₂ that was avoided or removed from the air",
          isCorrect: true,
          explanation:
            "Right. That's what makes it tradeable: a standard unit, like a kilo of rice at a market.",
        },
        {
          text: "A fine paid for polluting too much",
          isCorrect: false,
          explanation:
            "Understandable, since it does cost money! But a fine is a punishment. A credit is a tradeable permit or offset, which is the whole point of the market.",
        },
        {
          text: "A tree planted on your behalf",
          isCorrect: false,
          explanation:
            "Sometimes trees are involved, but the credit measures carbon, not trees. One tree absorbs far less than a tonne a year.",
        },
      ],
    },
  },

  // ── 5 ─────────────────────────────────────────────────────
  {
    id: "insider-trading",
    title: "The Secret You're Not Allowed to Trade On",
    subject: ["Finance", "Law"],
    format: "Story",
    blurb:
      "Meera overhears a merger over dinner and a little voice says 'buy shares'. A short story about why that voice can land you in court.",
    themes: ["Fairness", "Markets", "Temptation"],
    difficulty: 2,
    readThisFirst: ["terms-and-conditions"],
    realWorldHook: {
      text: "Insider-trading cases make the news every year, from executives to their cousins.",
      type: "Evergreen",
    },
    keyTerms: ["insider trading", "securities law", "markets", "fairness", "shares"],
    publishedDate: "2026-08-07",
    placeholder: true,
    body: `Meera's brother-in-law talks too much after his second glass of wine. Between the dal and dessert he lets it slip: his company is about to buy a smaller firm called Lumen, and Lumen's shares will "go through the roof" when it's announced on Monday.

On the drive home Meera opens her trading app. Lumen is cheap. Monday is three days away. Nobody would ever know.

What she's tempted to do has a name: **insider trading**, buying or selling shares using important information the public doesn't have yet. It isn't illegal because it's clever. It's illegal because it's *unfair*. A stock market only works if people trust they're playing the same game. If insiders can always win, everyone else stops playing.

And regulators do notice. Unusual buying right before a big announcement is exactly what their software is built to flag. They trace who bought, then who they know. "My brother-in-law mentioned it" isn't a defence; in many countries the person who passes on the tip and the person who trades on it can *both* be charged.

Meera closes the app. Monday comes, Lumen's price jumps, and she feels a small pang. Then she remembers she's not explaining a dinner conversation to an investigator, and the pang passes.`,
    checkIn: {
      question: "Why is insider trading illegal?",
      options: [
        {
          text: "Because it's unfair to other investors and erodes trust in the market",
          isCorrect: true,
          explanation:
            "Yes. The law protects the idea of a level playing field. Without it, ordinary investors would stay away.",
        },
        {
          text: "Because making money from shares quickly is against the law",
          isCorrect: false,
          explanation:
            "Not at all, quick profits are perfectly legal. The problem is *how* Meera would know: through private information others can't access.",
        },
        {
          text: "It's only illegal for the company's own employees",
          isCorrect: false,
          explanation:
            "A really common belief, but no. Friends and family who trade on a tip can be charged too, and so can the person who tipped them off.",
        },
      ],
    },
  },

  // ── 6 ─────────────────────────────────────────────────────
  {
    id: "what-makes-valuable",
    title: "What Makes Something Valuable?",
    subject: ["Philosophy", "Economics"],
    format: "Explainer",
    blurb:
      "Water keeps us alive and costs almost nothing; diamonds don't and cost a fortune. A centuries-old puzzle with a surprisingly human answer.",
    themes: ["Value", "Desire", "Scarcity"],
    difficulty: 2,
    readThisFirst: ["ship-of-theseus"],
    realWorldHook: {
      text: "Every price tag, salary and 'limited edition' drop is quietly answering this question.",
      type: "Evergreen",
    },
    keyTerms: ["value", "scarcity", "prices", "utility", "desire"],
    publishedDate: "2026-07-30",
    placeholder: true,
    body: `Adam Smith, the grandfather of economics, was stuck on a riddle. Nothing is more useful than water, yet it costs next to nothing. Diamonds are nearly useless, yet they cost a fortune. How can that be?

Philosophers had long split value into two kinds. There's *use value*: what a thing does for you. And there's *exchange value*: what someone will give you for it. Water wins the first contest easily. Diamonds win the second. So what decides the second?

The answer that eventually stuck is beautifully human: **value lives in the next unit, not the whole category.** You don't pay for "all water", you pay for one more glass, and most of us already have plenty. One more diamond, on the other hand, is rare, and rarity is something people will pay for. Economists call this thinking "at the margin".

> Value isn't a property of the object. It's a relationship between the object and someone who wants it.

That last line is where philosophy and economics shake hands. A first edition of a novel and a reprint carry identical words, yet one costs a hundred times more. The difference isn't on the page. It's in us: our stories, our scarcity, our desire.`,
    checkIn: {
      question: "According to the piece, why is water cheaper than diamonds?",
      options: [
        {
          text: "Because we value the next unit, and an extra glass of water matters far less than an extra diamond",
          isCorrect: true,
          explanation:
            "That's the margin idea. Usefulness overall isn't what sets price; how much we want one more is.",
        },
        {
          text: "Because diamonds are more useful than water",
          isCorrect: false,
          explanation:
            "Smith would smile at this one. Water is far more useful. That's exactly what made it a paradox!",
        },
        {
          text: "Because governments set the price of water low",
          isCorrect: false,
          explanation:
            "Sometimes true in practice, but the paradox holds even in free markets. The deeper answer is about scarcity and the 'next unit'.",
        },
      ],
    },
  },

  // ── 7 ─────────────────────────────────────────────────────
  {
    id: "ship-of-theseus",
    title: "The Ship of Theseus at the Tailor's",
    subject: ["Philosophy"],
    format: "Story",
    blurb:
      "A grandmother's sari is mended thread by thread for forty years. Is it still the same sari? An ancient puzzle about identity, retold.",
    themes: ["Identity", "Change", "Memory"],
    difficulty: 1,
    realWorldHook: {
      text: "Your body replaces most of its cells over the years. Are you still you?",
      type: "Evergreen",
    },
    keyTerms: ["identity", "change", "thought experiment", "value"],
    publishedDate: "2026-06-25",
    placeholder: true,
    body: `My grandmother had a silk sari she wore to every wedding. Over forty years, the tailor down the lane mended it: a new border here, a patch of fresh silk there, re-dyed once after a monsoon leak. By the end, he told her, there was probably not one original thread left.

"Same sari," she said firmly.

The ancient Greeks had a version of this. The hero Theseus's ship was kept in Athens as a monument, and as its planks rotted, they were replaced one by one. Eventually every plank was new. Philosophers asked: *is it still the Ship of Theseus?* And if someone collected all the old planks and rebuilt them into a ship, which one would be the real one?

There's no single correct answer, which is the point. If you think identity is about **material**, the sari is long gone. If it's about **continuity**, a gradual chain of small changes, it's the same sari. If it's about **meaning**, what it is to the people who love it, then my grandmother was obviously right.

I like her answer best. It also quietly explains why we pay more for things with a story attached, which is a puzzle for another piece.`,
    checkIn: {
      question: "What is the Ship of Theseus puzzle really about?",
      options: [
        {
          text: "Whether something stays the same thing when all its parts are replaced",
          isCorrect: true,
          explanation:
            "Yes! It's a puzzle about identity over time, which is why it works for ships, saris and even people.",
        },
        {
          text: "How ancient Greeks repaired their ships",
          isCorrect: false,
          explanation:
            "The ship is just the setting. The real question is philosophical: what makes something the 'same' thing?",
        },
        {
          text: "Whether new things are better than old things",
          isCorrect: false,
          explanation:
            "A lovely question, but a different one. This puzzle doesn't ask which is better, only which is the *same*.",
        },
      ],
    },
  },

  // ── 8 ─────────────────────────────────────────────────────
  {
    id: "terms-and-conditions",
    title: "Every 'I Agree' Is a Tiny Contract",
    subject: ["Law"],
    format: "Explainer",
    blurb:
      "You've signed hundreds of contracts this year without picking up a pen. Here's what makes a promise legally binding.",
    themes: ["Contracts", "Consent", "Everyday law"],
    difficulty: 1,
    realWorldHook: {
      text: "Every app sign-up, gym membership and rental agreement is built on these four ingredients.",
      type: "Evergreen",
    },
    keyTerms: ["contract", "consent", "agreement", "terms of service"],
    publishedDate: "2026-06-18",
    placeholder: true,
    body: `This morning I agreed to a new privacy policy, bought a metro ticket and ordered coffee. Legally speaking, I entered three contracts before 9 a.m. I didn't sign anything, and I certainly didn't read the policy.

A **contract** is simply a promise the law will enforce. Not every promise counts: if I promise to help you move house and don't turn up, you can be annoyed, but you can't sue. So what tips a promise into a contract? Most legal systems look for a few ingredients:

- **An offer:** "This coffee is ₹180."
- **Acceptance:** "I'll take it."
- **Something exchanged both ways:** my money, their coffee. Lawyers call this *consideration*.
- **An intention to be legally bound:** both sides understand this is a real deal, not a casual favour.

Notice what's missing: paper. A signature is great evidence, but it's rarely required. Clicking "I agree" is acceptance. So is tapping your card.

That's why the long, unread terms of service matter. They're the fine print of a contract you *did* accept. Courts sometimes refuse to enforce truly unfair or hidden clauses, but "I didn't read it" is, unfortunately, not usually a defence.`,
    checkIn: {
      question: "Which of these is usually NOT required for a contract?",
      options: [
        {
          text: "A written signature",
          isCorrect: true,
          explanation:
            "Correct! Signatures are useful evidence, but tapping a card or clicking 'I agree' can be acceptance too.",
        },
        {
          text: "An offer and an acceptance",
          isCorrect: false,
          explanation:
            "These are the backbone of nearly every contract, so they're very much required. Good instinct to double-check, though.",
        },
        {
          text: "Something given by each side",
          isCorrect: false,
          explanation:
            "That's 'consideration', and it's what separates a contract from a one-sided favour. It's usually needed.",
        },
      ],
    },
  },

  // ── 9 ─────────────────────────────────────────────────────
  {
    id: "precedent",
    title: "The Judge Who Read an Old Case Like a Novel",
    subject: ["Law"],
    format: "Story",
    blurb:
      "A young judge faces a case no law quite covers, and finds her answer in a decision made a hundred years ago. How precedent works.",
    themes: ["Courts", "History", "Interpretation"],
    difficulty: 3,
    readThisFirst: ["terms-and-conditions"],
    realWorldHook: {
      text: "Landmark judgments you read about are often fights over which old case should apply.",
      type: "Evergreen",
    },
    keyTerms: ["precedent", "courts", "interpretation", "common law", "contract"],
    publishedDate: "2026-09-04",
    placeholder: true,
    body: `Judge Rao had a problem. A delivery app had cancelled a rider's account without warning, and the rider claimed it broke their agreement. But the app's contract never said what happened in this exact situation, and no statute did either. The law, it seemed, had a blank page.

So she did what judges in *common law* systems have done for centuries: she went to the library of past decisions. Somewhere in there, she suspected, another judge had faced a question shaped like hers.

She found it in an old case about a shipping company that dropped a supplier without notice. Different century, different technology, but the same bones: one powerful party, a vague contract, and a weaker party left stranded. That court had ruled that some fairness was *implied* in the deal, even if nobody wrote it down.

This is **precedent**: earlier decisions guide later ones, so similar cases are treated alike. It makes the law predictable. It also means judges are, in a way, close readers. Judge Rao's real work wasn't finding the old case. It was arguing that its *principle* fit her facts, and explaining why the differences didn't matter.

> Precedent isn't copying an old answer. It's recognising an old question wearing new clothes.

Her judgment, in turn, became a page in that library. Some future judge, facing a question about drones or robots, may open it one day.`,
    checkIn: {
      question: "What did Judge Rao actually take from the old shipping case?",
      options: [
        {
          text: "Its underlying principle, which she argued applied to a new situation",
          isCorrect: true,
          explanation:
            "Exactly. Precedent works through principles. The skill is showing that the old reasoning fits the new facts.",
        },
        {
          text: "Its exact outcome, word for word",
          isCorrect: false,
          explanation:
            "Not quite. Facts are never identical, so judges carry over the reasoning, not a copy-paste result.",
        },
        {
          text: "Nothing; old cases don't apply to modern technology",
          isCorrect: false,
          explanation:
            "It can feel that way, but common law is designed so old principles stretch to fit new situations. That's its strength.",
        },
      ],
    },
  },

  // ── 10 ────────────────────────────────────────────────────
  {
    id: "village-pond",
    title: "The Village Pond Problem",
    subject: ["Sustainability"],
    format: "Story",
    blurb:
      "Ten families share one pond full of fish. Each takes just a little more than they should. A fable about why shared things get used up.",
    themes: ["Shared resources", "Cooperation", "Climate"],
    difficulty: 1,
    realWorldHook: {
      text: "Overfishing, traffic jams and a warming climate are all village ponds at different sizes.",
      type: "Evergreen",
    },
    keyTerms: ["tragedy of the commons", "shared resources", "climate", "externalities", "cooperation"],
    publishedDate: "2026-06-11",
    placeholder: true,
    body: `There was once a village with a pond, and the pond had fish, and ten families fished it. Each family took ten fish a week, and the pond refilled itself just fast enough. Everyone ate. Nobody worried.

Then one family thought: *if I take twelve, the pond won't notice two extra fish.* They were right. The pond didn't notice. So the next family took twelve too, and the next. Each decision was small and sensible on its own. Within a few years, the pond was nearly empty, and every family was worse off than if they'd all stuck to ten.

Economists call this the **tragedy of the commons**. When something is shared and nobody owns it, each person gets the full benefit of taking a bit more, while the cost is spread thinly across everyone. So everyone takes a bit more.

The atmosphere is the biggest village pond we have. Every factory, car and flight puts a little carbon into a sky that belongs to no one and everyone. No single choice breaks it. Together, they do.

The hopeful part? Real villages have solved this, with rules, trust, and sometimes a price on taking too much. That last idea is where carbon markets come from.`,
    checkIn: {
      question: "Why did the pond run out of fish?",
      options: [
        {
          text: "Each family's small extra catch made sense alone, but together it was too much",
          isCorrect: true,
          explanation:
            "That's the tragedy in one line: individually rational choices adding up to a shared loss.",
        },
        {
          text: "One greedy family took all the fish",
          isCorrect: false,
          explanation:
            "That's how villains work in most stories, but here nobody is a villain. That's what makes it so hard to fix.",
        },
        {
          text: "The fish naturally died out",
          isCorrect: false,
          explanation:
            "The pond refilled just fine at ten fish per family. It was the extra fishing, not nature, that emptied it.",
        },
      ],
    },
  },

  // ── 11 ────────────────────────────────────────────────────
  {
    id: "how-your-feed-works",
    title: "How Your Feed Decides What You See",
    subject: ["Tech"],
    format: "Explainer",
    blurb:
      "Your social feed isn't a timeline, it's a guess. A plain-language look at recommendation algorithms and what they're guessing for.",
    themes: ["Algorithms", "Attention", "Everyday tech"],
    difficulty: 1,
    realWorldHook: {
      text: "Open any app with an infinite scroll; you're looking at the output of this piece.",
      type: "Evergreen",
    },
    keyTerms: ["algorithm", "recommendation", "attention", "data", "machine learning"],
    publishedDate: "2026-07-16",
    placeholder: true,
    body: `When I first joined social media, posts showed up in the order people made them. Now my feed opens on a cooking video from someone I've never heard of. Nobody chose that for me. Something *predicted* it.

That something is a **recommendation algorithm**: a set of instructions that scores every possible post and shows you the highest scorers first. The score is a guess at one question: *how likely is this person to engage with this?* Watch it, like it, comment, share, or simply not scroll past.

To guess well, the system leans on clues. What you've lingered on before. What people similar to you enjoyed. What's popular right now. Each tiny action you take is feedback, and the guesses sharpen. That learning-from-feedback part is what people mean by *machine learning*.

The important thing to notice is *what* it's optimising for. Engagement isn't the same as usefulness or happiness. Outrage and novelty are very engaging. So feeds can drift towards what grabs you rather than what's good for you, not because anyone planned it, but because that's what the score rewards.

Knowing this doesn't make you immune. But it does turn the feed from a mirror into a guess, and guesses can be questioned.`,
    checkIn: {
      question: "What is a typical recommendation algorithm mostly trying to predict?",
      options: [
        {
          text: "How likely you are to engage with a post",
          isCorrect: true,
          explanation:
            "Right. Clicks, watch time, likes: engagement is the usual target, which explains a lot about what feeds show.",
        },
        {
          text: "Which posts are most accurate or true",
          isCorrect: false,
          explanation:
            "It would be lovely, but accuracy is hard for a system to measure. Engagement is easy to count, so that's usually what's scored.",
        },
        {
          text: "The order posts were published in",
          isCorrect: false,
          explanation:
            "That's how feeds used to work! Most big platforms moved away from pure chronological order years ago.",
        },
      ],
    },
  },

  // ── 12 ────────────────────────────────────────────────────
  {
    id: "ai-hallucinations",
    title: "Why AI Chatbots Sometimes Make Things Up",
    subject: ["Tech"],
    format: "News breakdown",
    blurb:
      "A chatbot invents a court case and a lawyer cites it. What 'hallucination' means, and why a very good autocomplete can be confidently wrong.",
    themes: ["Artificial intelligence", "Trust", "Language"],
    difficulty: 2,
    readThisFirst: ["how-your-feed-works"],
    realWorldHook: {
      text: "Placeholder hook: tied to recent news of AI-invented citations turning up in court filings.",
      type: "Timely",
    },
    keyTerms: ["artificial intelligence", "language models", "machine learning", "trust", "precedent"],
    publishedDate: "2026-09-25",
    placeholder: true,
    body: `Every so often a story goes round: a lawyer submits a brief full of court cases, and the judge discovers some of them don't exist. The lawyer had asked an AI chatbot for precedents, and the chatbot had *invented* them, complete with names, dates and convincing quotes.

To see why, it helps to know what these chatbots are. A **large language model** is trained on enormous amounts of text to do one thing very well: predict which words are likely to come next. Ask it a question and it writes the answer a fluent, well-read person would *probably* write. As a literature student, I think of it as a brilliant mimic of style.

Most of the time, the likely answer is also the true one. But when the model hasn't seen enough about something, it doesn't go quiet. It still produces the most plausible-sounding words. A fake case called *Sharma v. Union Logistics (2011)* looks exactly like a real one. That confident invention is what people call a **hallucination**.

Newer systems try to reduce this by checking sources, searching the web or saying "I'm not sure". They're getting better. But the safest habit is the one Judge Rao would recommend: treat a chatbot's answer as a first draft, and verify anything that matters.`,
    checkIn: {
      question: "Why can a language model produce a convincing but fake court case?",
      options: [
        {
          text: "It generates plausible-sounding text, which isn't always the same as true text",
          isCorrect: true,
          explanation:
            "Yes. It's optimised for likely words, so when facts are thin, plausibility can win over truth.",
        },
        {
          text: "It's deliberately trying to trick the user",
          isCorrect: false,
          explanation:
            "It can feel that way! But there's no intent behind it. It's predicting words, not plotting.",
        },
        {
          text: "It copied the fake case from a website",
          isCorrect: false,
          explanation:
            "Possible in rare cases, but hallucinations are usually brand-new inventions stitched together from patterns.",
        },
      ],
    },
  },

  // ── 13 ────────────────────────────────────────────────────
  {
    id: "library-of-alexandria",
    title: "The Library That Didn't Burn in a Day",
    subject: ["History"],
    format: "Story",
    blurb:
      "Everyone 'knows' the great Library of Alexandria went up in one tragic fire. The real story is slower, and more useful.",
    themes: ["Myths", "Knowledge", "Decline"],
    difficulty: 1,
    realWorldHook: {
      text: "Every time a newsroom, archive or website quietly shuts down, a little Alexandria happens.",
      type: "Evergreen",
    },
    keyTerms: ["history", "myth", "knowledge", "institutions"],
    publishedDate: "2026-10-14",
    placeholder: true,
    body: `I grew up with a picture in my head: flames licking marble shelves, scrolls curling into ash, all the knowledge of the ancient world gone in a single terrible night. It's a great scene. It's also mostly wrong.

The Library of Alexandria, in Egypt, was real and it was extraordinary. Scholars there copied, collected and argued over texts from across the Mediterranean world. But historians now think it didn't die in one blaze. It **faded over centuries**: funding dried up, scholars were expelled during political fights, parts were damaged in wars, and nobody kept replacing what was lost.

> Libraries rarely burn down. More often, they're simply no longer looked after.

Why does the myth stick? Because a single villain and a single fire make a better story than slow neglect. Stories love a dramatic moment. History, annoyingly, is often made of budgets and boredom.

That's the lesson I keep coming back to. The things we lose usually aren't snatched away in one night. They drain away while everyone assumes someone else is looking after them.`,
    checkIn: {
      question: "What do historians now think happened to the Library of Alexandria?",
      options: [
        {
          text: "It declined slowly, through lost funding, politics and damage over many years",
          isCorrect: true,
          explanation: "Yes. Less cinematic, but closer to the evidence: neglect and many smaller losses over centuries.",
        },
        {
          text: "It was destroyed in a single, famous fire",
          isCorrect: false,
          explanation: "That's the version most of us grew up with! It makes a great scene, but the evidence points to a much slower decline.",
        },
        {
          text: "It never really existed",
          isCorrect: false,
          explanation: "It definitely existed, and it was remarkable. The question historians argue about is how it ended, not whether it was there.",
        },
      ],
    },
  },

  // ── 14 ────────────────────────────────────────────────────
  {
    id: "spice-and-empires",
    title: "How a Pinch of Pepper Built Empires",
    subject: ["History", "Economics"],
    format: "Explainer",
    blurb:
      "Black pepper was once worth sailing halfway round the world for. How the hunt for spices reshaped maps, wars and even the stock market.",
    themes: ["Trade", "Empire", "Value"],
    difficulty: 2,
    readThisFirst: ["what-makes-valuable"],
    realWorldHook: {
      text: "The jar of pepper in your kitchen sits at the end of one of history's most violent supply chains.",
      type: "Evergreen",
    },
    keyTerms: ["trade", "scarcity", "value", "shares", "history", "empire"],
    publishedDate: "2026-10-14",
    placeholder: true,
    body: `It's hard to imagine now, standing in a supermarket aisle, but black pepper from India's Malabar coast was once so prized in Europe that people called it **black gold**. Cloves and nutmeg from a handful of tiny Indonesian islands were worth even more.

Why so valuable? Remember the water-and-diamonds puzzle: price follows *scarcity and desire*, not usefulness. Spices grew in only a few places, travelled through many middlemen, and were wanted badly by wealthy kitchens far away. Every hand they passed through added to the price.

So European powers went looking for a way to cut out the middlemen. That search sent ships around Africa and across oceans. It also needed enormous amounts of money for very risky voyages. One solution was to let many people buy small **shares** in a trading company, so no single investor lost everything if a ship sank. The Dutch East India Company, founded in 1602, is often described as one of the first companies to sell shares to the public this way.

The story isn't a happy one. Control of the spice islands was taken by force, and local people paid a terrible price. But it's a powerful example of how one desire, for flavour, can redraw maps and invent new kinds of money along the way.`,
    checkIn: {
      question: "Why were spices so expensive in Europe at the time?",
      options: [
        {
          text: "They were scarce, grew far away, and passed through many hands before arriving",
          isCorrect: true,
          explanation: "Right. Scarcity, distance and desire stacked up, and each middleman added to the price.",
        },
        {
          text: "They were necessary for survival",
          isCorrect: false,
          explanation: "A common assumption, but spices were a luxury. Like diamonds, their price came from scarcity and desire, not necessity.",
        },
        {
          text: "Governments taxed them heavily",
          isCorrect: false,
          explanation: "Taxes played a part along the route, but the main driver was how rare and far away they were.",
        },
      ],
    },
  },

  // ── 15 ────────────────────────────────────────────────────
  {
    id: "same-stories",
    title: "Why We Keep Telling the Same Stories",
    subject: ["Culture"],
    format: "Explainer",
    blurb:
      "A young hero leaves home, faces trials and returns changed. Why so many of our favourite stories share the same bones.",
    themes: ["Storytelling", "Myth", "Identity"],
    difficulty: 1,
    realWorldHook: {
      text: "Next time you watch a blockbuster, count the steps. You'll probably find most of them.",
      type: "Evergreen",
    },
    keyTerms: ["storytelling", "myth", "culture", "archetypes"],
    publishedDate: "2026-10-14",
    placeholder: true,
    body: `In my first year of literature classes, a professor drew a circle on the board and said, "This is almost every story you love." I was offended. Then she walked us through it, and I wasn't offended any more. I was a bit unsettled.

The circle was the **hero's journey**, a pattern the writer Joseph Campbell described after comparing myths from around the world. Someone ordinary is called to adventure. They hesitate, find a mentor, cross into an unfamiliar world, face trials, nearly lose everything, and return home changed. Ramayana, Star Wars, Harry Potter: the costumes differ, the skeleton doesn't.

Why would cultures that never met tell similar stories? One idea is that stories are how humans **rehearse life**. Leaving home, facing fear, coming back wiser: these are things almost everyone goes through. A shared shape makes a story easy to follow and easy to remember.

> A culture is partly the set of stories it agrees to keep retelling.

None of this makes stories less original. A sonnet always has fourteen lines, and yet no two good ones are the same. The pattern is the riverbed; the telling is the water.`,
    checkIn: {
      question: "According to the piece, why might so many cultures share the hero's journey shape?",
      options: [
        {
          text: "Because it mirrors experiences most people go through, like leaving home and facing fear",
          isCorrect: true,
          explanation: "Yes. Stories may be a way of rehearsing life, so a shape that matches common experience travels well.",
        },
        {
          text: "Because writers copied one original story",
          isCorrect: false,
          explanation: "Tempting, but many of these myths grew up in places with no contact. The similarity comes from shared human experience.",
        },
        {
          text: "Because the pattern was invented by modern filmmakers",
          isCorrect: false,
          explanation: "Filmmakers do use it a lot! But the pattern is far older than cinema; Campbell found it in ancient myths.",
        },
      ],
    },
  },

  // ── 16 ────────────────────────────────────────────────────
  {
    id: "who-owns-a-folk-song",
    title: "Who Owns a Folk Song?",
    subject: ["Culture", "Law"],
    format: "Story",
    blurb:
      "Asha remixes a song her grandmother sang at weddings, and it goes viral. Then a stranger claims the rights. Copyright meets tradition.",
    themes: ["Ownership", "Tradition", "Creativity"],
    difficulty: 2,
    readThisFirst: ["terms-and-conditions"],
    realWorldHook: {
      text: "Remixes, samples and 'traditional' tracks spark copyright fights on music platforms all the time.",
      type: "Evergreen",
    },
    keyTerms: ["copyright", "culture", "ownership", "public domain", "contract"],
    publishedDate: "2026-10-14",
    placeholder: true,
    body: `Asha's grandmother sang the same song at every wedding in the family. Nobody knew who wrote it. It was just *there*, like the smell of marigolds. So when Asha laid it over a beat and posted it, it didn't occur to her to ask anyone's permission.

The track took off. A week later, a message arrived from a small label: *they* had recorded the song years ago, and her video was "using their work".

Here's where it gets interesting. **Copyright** protects a particular creative expression, like a specific recording or a specific arrangement, for a limited time. Very old songs whose writers are long gone are usually in the **public domain**: free for anyone to sing, adapt or record. So the label likely owns *its recording*, but not the melody Asha's grandmother sang.

That means the real question is what Asha actually used. If she sang the tune herself, or used her grandmother's voice, she's probably fine. If she'd sampled the label's recording, that would be a different story.

The bigger puzzle is cultural. Law likes owners. Folk songs belong to everyone who's ever sung them. Asha ended up crediting "traditional, as sung by my Nani", which might be the most accurate credit of all.`,
    checkIn: {
      question: "What does the label most likely own?",
      options: [
        {
          text: "Its own recording of the song, but not the traditional melody itself",
          isCorrect: true,
          explanation: "Exactly. Copyright covers a specific expression, like a recording. The old tune is usually free for everyone.",
        },
        {
          text: "The song itself, because they recorded it first",
          isCorrect: false,
          explanation: "A very natural guess! But recording something first doesn't make you the owner of an old, traditional melody.",
        },
        {
          text: "Nothing at all",
          isCorrect: false,
          explanation: "Not quite. Their particular recording is their creative work, so copying that recording could still be a problem.",
        },
      ],
    },
  },
];
