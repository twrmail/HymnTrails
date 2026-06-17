"""
HymnTrails Database Builder
Constructs the hymns.json dataset: hymns and Psalm settings spanning
church history, each tagged with scripture anchor, doctrine, and a
contemporary "modern echo" song.

Lyric policy:
  - public_domain: true (pre-1929 per US copyright law) -> full verse(s) stored
  - public_domain: false -> short excerpt only (<15 words) + lyrics_link
    pointing to a legitimate source (Hymnary.org / Genius / official site)
"""

import json

HYMNS = []

def add(**kwargs):
    HYMNS.append(kwargs)

# ════════════════════════════════════════════════════════════════
# ERA: PSALMS SET TO MUSIC (the original hymnal)
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-001",
    title="The Lord's My Shepherd (Crimond)",
    author="Scottish Psalter / tune by Jessie Seymour Irvine",
    year=1650,
    public_domain=True,
    era="Reformation Psalter",
    scripture_anchor="Psalm 23",
    doctrine_tags=["Providence", "Sufficiency of God", "Rest"],
    full_text=(
        "The Lord's my Shepherd, I'll not want.\n"
        "He makes me down to lie\n"
        "In pastures green; He leadeth me\n"
        "The quiet waters by."
    ),
    notes="Metrical setting of Psalm 23 from the Scottish Psalter, sung to the tune "
          "Crimond. One of the most enduring direct musical settings of a Psalm text "
          "in the English-speaking church, sung at weddings, funerals, and ordinary "
          "Sunday worship alike for over 350 years.",
    modern_echo={
        "title": "Good to Me",
        "artist": "Audrey Assad",
        "year": 2013,
        "connection": "Echoes Psalm 23's shepherd imagery through the lens of personal "
                       "weakness and need, naming God as 'my Rock, my strength in every "
                       "season' — the same dependence the Psalter sets to music."
    }
)

add(
    id="hymn-002",
    title="Through All the Changing Scenes of Life",
    author="Tate & Brady, New Version of the Psalms of David",
    year=1696,
    public_domain=True,
    era="Reformation Psalter",
    scripture_anchor="Psalm 34",
    doctrine_tags=["Praise", "Deliverance", "Testimony"],
    full_text=(
        "Through all the changing scenes of life,\n"
        "in trouble and in joy,\n"
        "the praises of my God shall still\n"
        "my heart and tongue employ."
    ),
    notes="A direct paraphrase of Psalm 34:1-3, written for congregational singing "
          "after the earlier Sternhold and Hopkins Psalter fell out of favor for its "
          "clumsier verse. Tate and Brady aimed for poetic dignity without losing the "
          "Psalm's plain testimony of deliverance.",
    modern_echo={
        "title": "Blessed Be Your Name",
        "artist": "Matt Redman",
        "year": 2002,
        "connection": "Like Psalm 34, this song insists on praise 'in the wilderness' "
                       "as much as 'in the land of plenty' — praise as a constant "
                       "regardless of changing circumstance."
    }
)

add(
    id="hymn-003",
    title="O God, Our Help in Ages Past",
    author="Isaac Watts",
    year=1719,
    public_domain=True,
    era="Early English Hymnody",
    scripture_anchor="Psalm 90",
    doctrine_tags=["Eternity of God", "Human Frailty", "Providence"],
    full_text=(
        "O God, our help in ages past,\n"
        "our hope for years to come,\n"
        "our shelter from the stormy blast,\n"
        "and our eternal home."
    ),
    notes="Watts's paraphrase of Psalm 90, written to give English congregations "
          "hymns 'fitted to the state of the Gospel' rather than only rigid Psalter "
          "translations. It remains a staple at memorial and national-remembrance "
          "services, precisely because it holds human transience against God's "
          "eternity without flinching from either.",
    modern_echo={
        "title": "Same Power",
        "artist": "Jeremy Camp",
        "year": 2011,
        "connection": "Both songs anchor present-day hope in the unchanging, eternal "
                       "power of the God who has acted across all generations — Watts "
                       "looking backward through history, Camp pointing forward to "
                       "resurrection power available now."
    }
)

add(
    id="hymn-004",
    title="Jesus Shall Reign",
    author="Isaac Watts",
    year=1719,
    public_domain=True,
    era="Early English Hymnody",
    scripture_anchor="Psalm 72",
    doctrine_tags=["Kingdom of God", "Missions", "Christ's Reign"],
    full_text=(
        "Jesus shall reign where'er the sun\n"
        "does his successive journeys run;\n"
        "his kingdom stretch from shore to shore,\n"
        "till moons shall wax and wane no more."
    ),
    notes="A paraphrase of Psalm 72's vision of the ideal king whose reign reaches "
          "every nation. Watts wrote it as an explicitly missionary hymn over a "
          "century before the modern missions movement, reading the Psalm as a "
          "promise yet to be fulfilled across the whole earth.",
    modern_echo={
        "title": "King of Kings",
        "artist": "Hillsong Worship",
        "year": 2019,
        "connection": "Both trace the same trajectory — a king's reign extending to "
                       "the whole world — with King of Kings filling in the New "
                       "Testament fulfillment Watts's Psalm 72 was reaching toward."
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: REFORMATION & EARLY PROTESTANT HYMNODY
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-005",
    title="A Mighty Fortress Is Our God",
    author="Martin Luther",
    year=1529,
    public_domain=True,
    era="Reformation",
    scripture_anchor="Psalm 46",
    doctrine_tags=["Sovereignty of God", "Spiritual Warfare", "Refuge"],
    full_text=(
        "A mighty fortress is our God,\n"
        "a bulwark never failing;\n"
        "our helper he amid the flood\n"
        "of mortal ills prevailing."
    ),
    notes="Luther's free paraphrase of Psalm 46, written during one of the most "
          "turbulent seasons of his life — excommunicated, condemned by the Empire, "
          "the entire structure of Western Christendom arrayed against him. It became "
          "the unofficial anthem of the Reformation.",
    modern_echo={
        "title": "No Longer Slaves",
        "artist": "Bethel Music (Jonathan & Melissa Helser)",
        "year": 2014,
        "connection": "Both move from naming a real, threatening enemy to a "
                       "declaration of fearlessness grounded in identity and divine "
                       "protection — Luther's 'on earth is not his equal' answered by "
                       "'I'm no longer a slave to fear.'"
    }
)

add(
    id="hymn-006",
    title="All Creatures of Our God and King",
    author="Francis of Assisi (trans. William Henry Draper)",
    year=1225,
    public_domain=True,
    era="Medieval",
    scripture_anchor="Psalm 148",
    doctrine_tags=["Creation", "Praise", "Stewardship"],
    full_text=(
        "All creatures of our God and King,\n"
        "lift up your voice and with us sing,\n"
        "alleluia, alleluia!"
    ),
    notes="Adapted from Francis's Canticle of the Sun, written near the end of his "
          "life, possibly while he was nearly blind. Translated into English hymn "
          "form in 1919. One of the oldest hymn texts still in regular congregational "
          "use, predating the Reformation by three centuries.",
    modern_echo={
        "title": "How Great Is Our God",
        "artist": "Chris Tomlin",
        "year": 2004,
        "connection": "Both summon the whole of creation — sun, wind, stars — into a "
                       "single act of cosmic praise, treating worship as something the "
                       "entire created order is built to do, not just human voices."
    }
)

add(
    id="hymn-007",
    title="Come, Thou Fount of Every Blessing",
    author="Robert Robinson",
    year=1758,
    public_domain=True,
    era="18th Century Hymnody",
    scripture_anchor="1 Samuel 7:12 (Ebenezer); Jeremiah 2:13",
    doctrine_tags=["Grace", "Sanctification", "Prone to Wander"],
    full_text=(
        "Come, thou Fount of every blessing,\n"
        "tune my heart to sing thy grace;\n"
        "streams of mercy, never ceasing,\n"
        "call for songs of loudest praise."
    ),
    notes="Robinson wrote this at age 22, only to wander from faith for years "
          "afterward — making the hymn's third verse ('prone to wander... here's my "
          "heart, O take and seal it') almost prophetic of his own later struggle. "
          "He reportedly wept upon hearing it sung again decades later.",
    modern_echo={
        "title": "Come As You Are",
        "artist": "Crowder",
        "year": 2014,
        "connection": "Both extend an invitation to the spiritually wandering or "
                       "weary, naming the wandering honestly while insisting mercy is "
                       "wide enough to meet it."
    }
)

add(
    id="hymn-008",
    title="Rock of Ages",
    author="Augustus Toplady",
    year=1763,
    public_domain=True,
    era="18th Century Hymnody",
    scripture_anchor="Exodus 33:22; 1 Corinthians 10:4",
    doctrine_tags=["Atonement", "Justification", "Refuge in Christ"],
    full_text=(
        "Rock of ages, cleft for me,\n"
        "let me hide myself in thee;\n"
        "let the water and the blood,\n"
        "from thy wounded side which flowed,\n"
        "be of sin the double cure,\n"
        "save from wrath and make me pure."
    ),
    notes="Reportedly written by Toplady while sheltering from a storm in a cleft of "
          "rock in Burrington Combe, England — though the legend may postdate the "
          "hymn. The 'double cure' language reflects classic Reformed atonement "
          "theology: justification (saved from wrath) and sanctification (made pure) "
          "as two distinct works of grace.",
    modern_echo={
        "title": "Jesus Paid It All",
        "artist": "Kristian Stanfill (Passion)",
        "year": 2013,
        "connection": "Both center entirely on substitutionary atonement — refuge "
                       "found not in personal effort but in Christ's finished work, "
                       "'sin had left a crimson stain, he washed it white as snow.'"
    }
)

add(
    id="hymn-009",
    title="O for a Thousand Tongues to Sing",
    author="Charles Wesley",
    year=1739,
    public_domain=True,
    era="Methodist Revival",
    scripture_anchor="Psalm 103",
    doctrine_tags=["Conversion", "Praise", "Redemption"],
    full_text=(
        "O for a thousand tongues to sing\n"
        "my great Redeemer's praise,\n"
        "the glories of my God and King,\n"
        "the triumphs of his grace!"
    ),
    notes="Wesley wrote this on the first anniversary of his conversion experience at "
          "Aldersgate. The hymn opens the entire 1780 Wesleyan hymnal and was written "
          "explicitly as personal testimony — a man trying to find language adequate "
          "to a transformation he felt he could never fully describe.",
    modern_echo={
        "title": "Forever (We Sing Hallelujah)",
        "artist": "Kari Jobe",
        "year": 2014,
        "connection": "Both reach for superlative, almost excessive language to "
                       "describe praise that feels too large for ordinary words — "
                       "Wesley's 'thousand tongues' answered by Jobe's sustained "
                       "'forever' refrain."
    }
)

add(
    id="hymn-010",
    title="Love Divine, All Loves Excelling",
    author="Charles Wesley",
    year=1747,
    public_domain=True,
    era="Methodist Revival",
    scripture_anchor="Colossians 3:14; 1 John 4:16-19",
    doctrine_tags=["Sanctification", "Love as Telos", "Christian Perfection"],
    full_text=(
        "Love divine, all loves excelling,\n"
        "joy of heaven, to earth come down;\n"
        "fix in us thy humble dwelling,\n"
        "all thy faithful mercies crown."
    ),
    notes="Wesley's great hymn of sanctification, asking that divine love take up "
          "permanent residence in the believer until they are entirely conformed to "
          "it — 'changed from glory into glory, till in heaven we take our place.' "
          "Reflects the Wesleyan doctrine of Christian perfection as a real, "
          "attainable work of grace.",
    modern_echo={
        "title": "Holy Spirit",
        "artist": "Francesca Battistelli / Bryan & Katie Torwalt",
        "year": 2011,
        "connection": "Both pray for the same thing: God's presence and love to fully "
                       "occupy and transform the inner life, not remain at a "
                       "comfortable distance — 'let us become more aware of your "
                       "presence.'"
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: 19th CENTURY HYMNODY
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-011",
    title="Amazing Grace",
    author="John Newton",
    year=1779,
    public_domain=True,
    era="19th Century Hymnody",
    scripture_anchor="Ephesians 2:1-9; Luke 15:11-32",
    doctrine_tags=["Grace", "Justification", "Conversion"],
    full_text=(
        "Amazing grace, how sweet the sound,\n"
        "that saved a wretch like me;\n"
        "I once was lost, but now am found,\n"
        "was blind, but now I see."
    ),
    notes="Newton wrote this reflecting on his own history as a former slave-trading "
          "ship captain turned Anglican priest and abolitionist. The word 'wretch' is "
          "not false humility — it's the testimony of a man who knew precisely how "
          "far grace had to reach to find him.",
    modern_echo={
        "title": "Reckless Love",
        "artist": "Cory Asbury",
        "year": 2017,
        "connection": "Both describe grace as something that defies proportion or "
                       "merit — Newton's grace for a 'wretch,' Asbury's love that "
                       "'chases me down, fights till I'm found' regardless of how far "
                       "one has run."
    }
)

add(
    id="hymn-012",
    title="It Is Well with My Soul",
    author="Horatio Spafford",
    year=1873,
    public_domain=True,
    era="19th Century Hymnody",
    scripture_anchor="Psalm 22; Philippians 4:7",
    doctrine_tags=["Lament", "Hope in Suffering", "Peace of God"],
    full_text=(
        "When peace like a river attendeth my way,\n"
        "when sorrows like sea billows roll;\n"
        "whatever my lot, thou hast taught me to say,\n"
        "it is well, it is well with my soul."
    ),
    notes="Written after Spafford's four daughters drowned when their ship sank "
          "crossing the Atlantic; he wrote the hymn crossing the same ocean himself "
          "soon after, reportedly near the location of the wreck. Not a hymn of easy "
          "comfort — a hymn that has stared at the worst possible loss and still "
          "found ground to stand on.",
    modern_echo={
        "title": "Praise You in This Storm",
        "artist": "Casting Crowns",
        "year": 2005,
        "connection": "Both name disappointment with God's apparent inaction honestly "
                       "— 'I was sure by now, God, that you would have reached down' — "
                       "and choose praise not because pain resolved, but in spite of "
                       "it remaining."
    }
)

add(
    id="hymn-013",
    title="Great Is Thy Faithfulness",
    author="Thomas Chisholm",
    year=1923,
    public_domain=True,
    era="Early 20th Century Hymnody",
    scripture_anchor="Lamentations 3:22-23",
    doctrine_tags=["Faithfulness of God", "Providence", "Daily Grace"],
    full_text=(
        "Great is thy faithfulness, O God my Father,\n"
        "there is no shadow of turning with thee;\n"
        "thou changest not, thy compassions, they fail not;\n"
        "as thou hast been, thou forever wilt be."
    ),
    notes="Chisholm wrote over 1,200 hymn texts while working as an insurance agent, "
          "having been told as a young man he was too frail for full-time ministry. "
          "This hymn directly paraphrases Lamentations 3 — written in the middle of "
          "the book's intense grief, where faithfulness is affirmed not from comfort "
          "but from the depths of lament.",
    modern_echo={
        "title": "Faithful",
        "artist": "Brandon Heath / various",
        "year": 2013,
        "connection": "Both anchor present trust in God's unbroken track record — the "
                       "argument is never 'things are fine,' but 'he has always been "
                       "faithful, so he will be now too.'"
    }
)

add(
    id="hymn-014",
    title="Be Thou My Vision",
    author="Ancient Irish (trans. Eleanor Hull); tune Slane",
    year=1905,
    public_domain=True,
    era="Celtic / 20th Century Translation",
    scripture_anchor="Psalm 73:25-26; Philippians 3:8",
    doctrine_tags=["Discipleship", "Christ as Treasure", "Surrender"],
    full_text=(
        "Be thou my vision, O Lord of my heart;\n"
        "naught be all else to me, save that thou art;\n"
        "thou my best thought, by day or by night,\n"
        "waking or sleeping, thy presence my light."
    ),
    notes="Translated from an Old Irish poem possibly dating to the 6th-8th century, "
          "attributed in legend to Saint Dallán Forgaill. The prayer reorders every "
          "priority around a single center: Christ as the only thing worth ultimate "
          "attachment, echoing Paul's 'I count all things loss' in Philippians 3.",
    modern_echo={
        "title": "The Heart of Worship",
        "artist": "Matt Redman",
        "year": 1999,
        "connection": "Both strip worship down to a single core posture — 'I'm coming "
                       "back to the heart of worship, and it's all about you' answers "
                       "the ancient prayer's insistence that nothing else matters "
                       "except this."
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: AFRICAN AMERICAN SPIRITUALS
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-015",
    title="Wade in the Water",
    author="Traditional African American Spiritual",
    year=1901,
    public_domain=True,
    era="Spiritual",
    scripture_anchor="Exodus 14:21-29; John 5:1-4",
    doctrine_tags=["Deliverance", "Baptism", "Liberation"],
    full_text=(
        "Wade in the water,\n"
        "wade in the water, children,\n"
        "wade in the water,\n"
        "God's gonna trouble the water."
    ),
    notes="A spiritual carrying layered meaning: a reference to the Red Sea crossing "
          "and to the healing pool of Bethesda, and historically understood as having "
          "carried coded instruction for enslaved people seeking freedom via the "
          "Underground Railroad — wading in water to throw off pursuing dogs. "
          "Deliverance theology and lived deliverance fused into one song.",
    modern_echo={
        "title": "Way Maker",
        "artist": "Sinach / Leeland",
        "year": 2016,
        "connection": "Both declare God as the one who makes a way through "
                       "impossible circumstance — the Red Sea crossing of Exodus 14 "
                       "echoed in 'way maker, miracle worker, promise keeper.'"
    }
)

add(
    id="hymn-016",
    title="Steal Away to Jesus",
    author="Wallace Willis (traditional)",
    year=1862,
    public_domain=True,
    era="Spiritual",
    scripture_anchor="Matthew 11:28-30; 1 Thessalonians 4:16-17",
    doctrine_tags=["Rest in Christ", "Hope", "Eschatology"],
    full_text=(
        "Steal away, steal away,\n"
        "steal away to Jesus!\n"
        "Steal away, steal away home,\n"
        "I ain't got long to stay here."
    ),
    notes="Composed by Wallace Willis, an enslaved man in Indian Territory (present "
          "Oklahoma), and preserved by the Fisk Jubilee Singers after emancipation. "
          "Carries a double meaning of intimate communion with Christ and longing for "
          "ultimate freedom — language of rest and homegoing under genuinely "
          "oppressive circumstance.",
    modern_echo={
        "title": "I Can Only Imagine",
        "artist": "MercyMe",
        "year": 1999,
        "connection": "Both look past present hardship toward unmediated encounter "
                       "with Christ — 'I ain't got long to stay here' answered by "
                       "'surrounded by your glory, what will my heart feel.'"
    }
)

add(
    id="hymn-017",
    title="There Is a Balm in Gilead",
    author="Traditional African American Spiritual",
    year=1907,
    public_domain=True,
    era="Spiritual",
    scripture_anchor="Jeremiah 8:22",
    doctrine_tags=["Healing", "Holy Spirit", "Comfort"],
    full_text=(
        "There is a balm in Gilead\n"
        "to make the wounded whole;\n"
        "there is a balm in Gilead\n"
        "to heal the sin-sick soul."
    ),
    notes="Drawn from Jeremiah's anguished question — 'Is there no physician there?' "
          "— the spiritual answers the prophet's lament with assurance: yes, there is "
          "a balm, and it heals exactly the wound named, sin-sickness, not merely "
          "physical injury.",
    modern_echo={
        "title": "Heal Our Land",
        "artist": "Travis Greene",
        "year": 2018,
        "connection": "Both apply Old Testament healing language directly to present "
                       "spiritual and communal brokenness, treating ancient promise as "
                       "still operative now."
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: 20th CENTURY GOSPEL & HYMNODY
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-018",
    title="How Great Thou Art",
    author="Carl Boberg (trans. Stuart K. Hine)",
    year=1885,
    public_domain=True,
    era="20th Century Hymnody",
    scripture_anchor="Psalm 8; Psalm 19:1-4",
    doctrine_tags=["Creation", "Majesty of God", "Awe"],
    full_text=(
        "O Lord my God, when I in awesome wonder\n"
        "consider all the worlds thy hands have made,\n"
        "I see the stars, I hear the rolling thunder,\n"
        "thy power throughout the universe displayed."
    ),
    notes="Boberg wrote the original Swedish text after a sudden thunderstorm gave "
          "way to a calm, sunlit view of a bay near his home. Hine's English "
          "translation, completed while serving as a missionary in Eastern Europe, "
          "added a fourth verse about Christ's return after hearing testimonies from "
          "persecuted believers.",
    modern_echo={
        "title": "How Great Is Our God",
        "artist": "Chris Tomlin",
        "year": 2004,
        "connection": "Functions almost as a direct contemporary companion — both "
                       "move from creation's vastness to the conclusion that the "
                       "Creator's greatness exceeds it, 'name above all names, worthy "
                       "of all praise.'"
    }
)

add(
    id="hymn-019",
    title="In Christ Alone",
    author="Keith Getty & Stuart Townend",
    year=2001,
    public_domain=False,
    era="Modern Hymnody",
    scripture_anchor="Colossians 1:15-20; Philippians 3:8-9",
    doctrine_tags=["Christology", "Atonement", "Assurance"],
    excerpt="In Christ alone my hope is found, He is my light, my strength",
    lyrics_link="https://www.gettymusic.com/in-christ-alone",
    notes="Written explicitly to function as a modern hymn rather than a praise "
          "chorus — dense, doctrinally precise, structured in classic four-verse "
          "hymn form. Widely regarded as one of the most significant additions to "
          "congregational hymnody since the mid-20th century, sometimes called the "
          "'modern Rock of Ages' for its sustained focus on the cross and "
          "resurrection.",
    modern_echo={
        "title": "Cornerstone",
        "artist": "Hillsong Worship",
        "year": 2012,
        "connection": "Both build entirely on Christ as foundation rather than "
                       "circumstance — 'Christ alone, cornerstone, weak made strong "
                       "in the Savior's love' is almost a direct echo of Getty and "
                       "Townend's own refrain."
    }
)

add(
    id="hymn-020",
    title="Turn Your Eyes upon Jesus",
    author="Helen Howarth Lemmel",
    year=1922,
    public_domain=True,
    era="20th Century Hymnody",
    scripture_anchor="Hebrews 12:2",
    doctrine_tags=["Fixing Eyes on Christ", "Sanctification", "Perspective"],
    full_text=(
        "O soul, are you weary and troubled?\n"
        "No light in the darkness you see?\n"
        "There's light for a look at the Savior,\n"
        "and life more abundant and free."
    ),
    notes="Lemmel wrote this after reading a gospel tract containing the line 'turn "
          "your eyes upon Jesus, look full in His wonderful face.' She set it to "
          "music within thirty minutes. The hymn's whole theology is the same move "
          "Hebrews 12:2 commands: redirect attention, and the trouble doesn't "
          "necessarily vanish, but it shrinks in proportion.",
    modern_echo={
        "title": "Fix My Eyes",
        "artist": "For King & Country",
        "year": 2015,
        "connection": "Shares not only the doctrine but nearly the exact title and "
                       "central image — both make the act of redirected attention the "
                       "whole engine of spiritual change."
    }
)

add(
    id="hymn-021",
    title="It Is Well (Bethel)",
    author="Kristene DiMarco / Bethel Music",
    year=2016,
    public_domain=False,
    era="Contemporary Worship",
    scripture_anchor="2 Kings 4:8-37",
    doctrine_tags=["Faith Under Trial", "Resurrection Power", "Lament"],
    excerpt="Even when my eyes don't see, I will trust, I will trust",
    lyrics_link="https://hymnary.org/text/even_when_my_eyes_dont_see_i_will_trust",
    notes="Inspired by the Shunammite woman's reply 'it is well' (2 Kings 4:26) when "
          "asked about her dead son, before Elisha raises him — a far darker context "
          "than the phrase's common comforting use. The song deliberately sits inside "
          "that tension: declaring wellness before the resolution, not after.",
    modern_echo={
        "title": "It Is Well with My Soul (traditional)",
        "artist": "Horatio Spafford (1873)",
        "year": 1873,
        "connection": "A rare case where the modern song's natural 'echo' runs "
                       "backward to the 19th century hymn it shares both a title and "
                       "a theological posture with — both declare wellness from "
                       "inside, not after, genuine loss."
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: ADVENT, CHRISTMAS & INCARNATION
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-022",
    title="O Come, O Come, Emmanuel",
    author="Latin antiphons (8th-9th c.); trans. John Mason Neale",
    year=1851,
    public_domain=True,
    era="Medieval / Advent",
    scripture_anchor="Isaiah 7:14; Isaiah 11:1-10",
    doctrine_tags=["Messianic Hope", "Advent", "Longing"],
    full_text=(
        "O come, O come, Emmanuel,\n"
        "and ransom captive Israel,\n"
        "that mourns in lonely exile here\n"
        "until the Son of God appear."
    ),
    notes="Derived from the medieval 'O Antiphons' sung in the week before Christmas, "
          "each addressing Christ by a different Messianic title from Isaiah. The "
          "minor key and the word 'mourns' keep Advent honest about waiting — joy "
          "deferred, not yet arrived, which is precisely the emotional register Isaiah's "
          "original prophecies were written into.",
    modern_echo={
        "title": "Labor Room",
        "artist": "Andrew Peterson",
        "year": 2004,
        "connection": "Both sit inside the ache of waiting for the Incarnation rather "
                       "than skipping to its resolution, treating longing itself as "
                       "theologically appropriate, not a failure of faith."
    }
)

add(
    id="hymn-023",
    title="Hark! The Herald Angels Sing",
    author="Charles Wesley (rev. George Whitefield)",
    year=1739,
    public_domain=True,
    era="Methodist Revival",
    scripture_anchor="Luke 2:8-14",
    doctrine_tags=["Incarnation", "Christology", "Peace"],
    full_text=(
        "Hark! the herald angels sing,\n"
        "'Glory to the newborn King;\n"
        "peace on earth, and mercy mild,\n"
        "God and sinners reconciled.'"
    ),
    notes="Wesley's original opening line was 'Hark how all the welkin rings' — "
          "Whitefield's revision to 'herald angels' decades later is what made it "
          "singable and lasting. The third verse's 'veiled in flesh the Godhead see' "
          "is dense incarnational theology disguised as a carol.",
    modern_echo={
        "title": "Labor Room",
        "artist": "Andrew Peterson",
        "year": 2004,
        "connection": "Both insist the Incarnation was a real, physical, costly "
                       "event — angels announcing it in one, the unglamorous reality "
                       "of birth itself in the other."
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: HOLY WEEK & RESURRECTION
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-024",
    title="When I Survey the Wondrous Cross",
    author="Isaac Watts",
    year=1707,
    public_domain=True,
    era="Early English Hymnody",
    scripture_anchor="Galatians 6:14; Philippians 2:5-8",
    doctrine_tags=["Atonement", "Self-Denial", "Cross-Centered Devotion"],
    full_text=(
        "When I survey the wondrous cross\n"
        "on which the Prince of glory died,\n"
        "my richest gain I count but loss,\n"
        "and pour contempt on all my pride."
    ),
    notes="Widely regarded as the first hymn in English to focus entirely on the "
          "subjective response of the believer to the cross, rather than simply "
          "narrating events. Watts revolutionized English hymnody by writing as "
          "personal testimony rather than only Psalm paraphrase.",
    modern_echo={
        "title": "O Praise the Name (Anástasis)",
        "artist": "Hillsong Worship",
        "year": 2015,
        "connection": "Both move through the full arc — crucifixion, burial, "
                       "resurrection — landing not on grief but worship, 'I was once "
                       "a slave to sin, but now I have been set free.'"
    }
)

add(
    id="hymn-025",
    title="Were You There",
    author="Traditional African American Spiritual",
    year=1899,
    public_domain=True,
    era="Spiritual",
    scripture_anchor="Matthew 27:32-56",
    doctrine_tags=["Crucifixion", "Lament", "Identification with Christ's Suffering"],
    full_text=(
        "Were you there when they crucified my Lord?\n"
        "Were you there when they crucified my Lord?\n"
        "Oh! Sometimes it causes me to tremble, tremble, tremble.\n"
        "Were you there when they crucified my Lord?"
    ),
    notes="Unlike triumphant Easter hymns, this spiritual stays inside Friday's "
          "horror without rushing to Sunday. The repeated trembling is not "
          "performative — it asks the singer to actually inhabit the weight of the "
          "crucifixion before any resolution is offered.",
    modern_echo={
        "title": "Man of Sorrows",
        "artist": "Hillsong Worship",
        "year": 2013,
        "connection": "Both refuse to look away from the brutality of the cross "
                       "before arriving at its meaning — 'the sin of man and wrath of "
                       "God has been on Jesus laid' sits in the same register as "
                       "'were you there.'"
    }
)

add(
    id="hymn-026",
    title="Christ the Lord Is Risen Today",
    author="Charles Wesley",
    year=1739,
    public_domain=True,
    era="Methodist Revival",
    scripture_anchor="1 Corinthians 15:1-22",
    doctrine_tags=["Resurrection", "Victory over Death", "Easter"],
    full_text=(
        "Christ the Lord is risen today, Alleluia!\n"
        "sons of men and angels say, Alleluia!\n"
        "raise your joys and triumphs high, Alleluia!\n"
        "sing, ye heavens, and earth reply, Alleluia!"
    ),
    notes="The standard Easter processional hymn in English-speaking churches for "
          "nearly three centuries, paired almost universally with the tune Easter "
          "Hymn. Each line's repeated 'Alleluia' makes the hymn structurally "
          "interrupt itself with praise, unable to complete a sentence without it.",
    modern_echo={
        "title": "Living Hope",
        "artist": "Phil Wickham",
        "year": 2018,
        "connection": "Both ground present hope explicitly in the historical "
                       "resurrection event — 'death has lost its grip on me' is "
                       "Wickham's restatement of Wesley's victorious Alleluias in "
                       "contemporary language."
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: TRUST, SUFFERING & PROVIDENCE
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-027",
    title="His Eye Is on the Sparrow",
    author="Civilla D. Martin (music Charles H. Gabriel)",
    year=1905,
    public_domain=True,
    era="20th Century Hymnody",
    scripture_anchor="Matthew 6:26; Matthew 10:29-31",
    doctrine_tags=["Providence", "Comfort", "Value to God"],
    full_text=(
        "Why should I feel discouraged,\n"
        "why should the shadows come,\n"
        "why should my heart be lonely,\n"
        "and long for heaven and home?"
    ),
    notes="Written after Martin visited a bedridden, longtime-paralyzed friend who "
          "told her she remained content because 'His eye is on the sparrow, and I "
          "know He watches me.' The hymn directly transcribes that woman's own "
          "spoken theology into song.",
    modern_echo={
        "title": "You Say",
        "artist": "Lauren Daigle",
        "year": 2018,
        "connection": "Both counter discouragement not with circumstance-based "
                       "comfort but with a declared truth about identity and worth in "
                       "God's sight — 'you say I am loved when I can't feel a thing.'"
    }
)

add(
    id="hymn-028",
    title="It Is No Secret (What God Can Do)",
    author="Stuart Hamblen",
    year=1950,
    public_domain=False,
    era="Mid-20th Century Gospel",
    scripture_anchor="Romans 8:31-39",
    doctrine_tags=["Testimony", "God's Power", "Personal Faith"],
    excerpt="The chimes of time ring out the news, another day is through",
    lyrics_link="https://hymnary.org/text/the_chimes_of_time_ring_out_the_news",
    notes="Hamblen wrote this shortly after his own dramatic conversion at a Billy "
          "Graham crusade in 1949, having previously been a hard-drinking Hollywood "
          "actor and radio host. The plain, almost folksy testimony style reflects "
          "mid-century American gospel music's directness.",
    modern_echo={
        "title": "Same God",
        "artist": "Elevation Worship",
        "year": 2021,
        "connection": "Both insist God's power demonstrated to others is equally "
                       "available now — 'what God can do' answered by 'the same God "
                       "that's never failed me yet.'"
    }
)

add(
    id="hymn-029",
    title="Day by Day",
    author="Lina Sandell",
    year=1865,
    public_domain=True,
    era="19th Century Hymnody",
    scripture_anchor="Deuteronomy 33:25; Matthew 6:34",
    doctrine_tags=["Daily Grace", "Sufficiency", "Trust"],
    full_text=(
        "Day by day, and with each passing moment,\n"
        "strength I find to meet my trials here;\n"
        "trusting in my Father's wise bestowment,\n"
        "I've no cause for worry or for fear."
    ),
    notes="Sandell wrote extensively after witnessing her father drown in a boating "
          "accident she survived. Her hymns consistently emphasize daily, "
          "moment-by-moment sufficiency rather than promising an absence of "
          "hardship — grace calibrated to the size of the day, not the size of "
          "life's total weight.",
    modern_echo={
        "title": "New Every Morning",
        "artist": "Vertical Worship",
        "year": 2019,
        "connection": "Both draw on the Lamentations 3 principle that mercy is "
                       "renewed daily rather than granted once for the whole of life "
                       "in advance."
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: CHURCH, COMMUNION & BODY OF CHRIST
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-030",
    title="The Church's One Foundation",
    author="Samuel John Stone",
    year=1866,
    public_domain=True,
    era="19th Century Hymnody",
    scripture_anchor="1 Corinthians 3:11; Ephesians 2:19-22",
    doctrine_tags=["Ecclesiology", "Unity", "Foundation in Christ"],
    full_text=(
        "The Church's one foundation\n"
        "is Jesus Christ her Lord;\n"
        "she is His new creation\n"
        "by water and the Word."
    ),
    notes="Written partly in response to theological controversy over biblical "
          "authority in the Church of England, the hymn insists the Church's unity "
          "rests on Christ himself rather than any human institution, doctrine "
          "dispute, or denominational structure.",
    modern_echo={
        "title": "Build My Life",
        "artist": "Pat Barrett / Housefires",
        "year": 2017,
        "connection": "Both use foundation/building imagery to locate ultimate "
                       "security in Christ rather than any structure built by human "
                       "hands, individual or corporate."
    }
)

add(
    id="hymn-031",
    title="Let Us Break Bread Together",
    author="Traditional African American Spiritual",
    year=1925,
    public_domain=True,
    era="Spiritual",
    scripture_anchor="1 Corinthians 11:23-26; Acts 2:42",
    doctrine_tags=["Communion", "Koinonia", "Confession"],
    full_text=(
        "Let us break bread together on our knees;\n"
        "let us break bread together on our knees.\n"
        "When I fall on my knees,\n"
        "with my face to the rising sun,\n"
        "O Lord, have mercy on me."
    ),
    notes="A communion spiritual whose posture — kneeling, facing the rising sun, "
          "asking mercy — frames the Lord's Supper as an act of humility and "
          "confession before it is anything else, consistent with Paul's warning in "
          "1 Corinthians 11 against approaching the table carelessly.",
    modern_echo={
        "title": "At the Table",
        "artist": "Josh Baldwin / Bethel Music",
        "year": 2020,
        "connection": "Both center communion as an act of humble gathering before "
                       "God and one another, treating the table as the place where "
                       "mercy is both received and shared."
    }
)

add(
    id="hymn-032",
    title="They'll Know We Are Christians by Our Love",
    author="Peter Scholtes",
    year=1966,
    public_domain=False,
    era="20th Century Hymnody",
    scripture_anchor="John 13:34-35",
    doctrine_tags=["Love as Telos", "Unity", "Christian Witness"],
    excerpt="We are one in the Spirit, we are one in the Lord",
    lyrics_link="https://hymnary.org/text/we_are_one_in_the_spirit_we_are_one",
    notes="Scholtes wrote this for a youth group needing a song about racial "
          "reconciliation and unity, drawing directly on Jesus's words in John 13 "
          "that love — not doctrine, not institutional structure — is the mark by "
          "which the world will recognize true disciples.",
    modern_echo={
        "title": "One Love",
        "artist": "TobyMac",
        "year": 2018,
        "connection": "Both make love the central, visible evidence of authentic "
                       "Christian community, treating unity as a witness to outsiders "
                       "rather than only an internal virtue."
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: HOLY SPIRIT & PENTECOST
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-033",
    title="Breathe on Me, Breath of God",
    author="Edwin Hatch",
    year=1878,
    public_domain=True,
    era="19th Century Hymnody",
    scripture_anchor="Ezekiel 37:1-14; John 20:22",
    doctrine_tags=["Holy Spirit", "Regeneration", "Sanctification"],
    full_text=(
        "Breathe on me, Breath of God,\n"
        "fill me with life anew,\n"
        "that I may love what thou dost love,\n"
        "and do what thou wouldst do."
    ),
    notes="Draws directly on Ezekiel's vision of dry bones receiving breath and on "
          "Jesus breathing on the disciples after the resurrection — both moments "
          "where divine breath transforms death into life. The hymn asks for the "
          "same act to be repeated personally.",
    modern_echo={
        "title": "Breathe",
        "artist": "Maverick City Music",
        "year": 2021,
        "connection": "Nearly identical request across 150 years — both ask for the "
                       "Spirit's indwelling presence using the specific image of "
                       "breath as sustaining, life-giving air."
    }
)

add(
    id="hymn-034",
    title="Spirit of the Living God",
    author="Daniel Iverson",
    year=1926,
    public_domain=False,
    era="20th Century Gospel",
    scripture_anchor="Ezekiel 36:26-27",
    doctrine_tags=["Holy Spirit", "Renewal", "Surrender"],
    excerpt="Spirit of the living God, fall fresh on me",
    lyrics_link="https://hymnary.org/text/spirit_of_the_living_god_fall_fresh_on",
    notes="Iverson reportedly wrote this in a few minutes after hearing a sermon on "
          "Ezekiel's promise of a new heart and new spirit, intending it as a simple "
          "personal prayer rather than a hymn for publication. Its brevity and "
          "directness have kept it in continuous use across nearly every Protestant "
          "tradition since.",
    modern_echo={
        "title": "Spirit Lead Me",
        "artist": "Michael Ketterer / Influence Music",
        "year": 2015,
        "connection": "Both frame the Spirit's work as something actively yielded to "
                       "rather than passively received — 'melt me, mold me' answered "
                       "by 'spirit lead me where my trust is without borders.'"
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: TRINITY & DOXOLOGY
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-035",
    title="Holy, Holy, Holy! Lord God Almighty",
    author="Reginald Heber",
    year=1826,
    public_domain=True,
    era="19th Century Hymnody",
    scripture_anchor="Revelation 4:8-11; Isaiah 6:1-3",
    doctrine_tags=["Trinity", "Holiness of God", "Worship"],
    full_text=(
        "Holy, holy, holy! Lord God Almighty!\n"
        "Early in the morning our song shall rise to thee;\n"
        "holy, holy, holy! merciful and mighty!\n"
        "God in three persons, blessed Trinity!"
    ),
    notes="Written by an Anglican bishop explicitly for Trinity Sunday, deliberately "
          "structured around the threefold 'holy' from both Isaiah's throne-room "
          "vision and the four living creatures of Revelation 4 — one of the few "
          "hymns that names the doctrine of the Trinity outright rather than only "
          "implying it.",
    modern_echo={
        "title": "Holy Forever",
        "artist": "CeCe Winans / Brandon Lake",
        "year": 2021,
        "connection": "Both draw directly from the same Revelation 4 throne-room "
                       "vision, structuring the entire song around the unceasing "
                       "'holy, holy, holy' of the heavenly worship scene."
    }
)

add(
    id="hymn-036",
    title="Praise God, from Whom All Blessings Flow (The Doxology)",
    author="Thomas Ken",
    year=1674,
    public_domain=True,
    era="17th Century Hymnody",
    scripture_anchor="Matthew 28:19; James 1:17",
    doctrine_tags=["Trinity", "Gratitude", "Doxology"],
    full_text=(
        "Praise God, from whom all blessings flow;\n"
        "praise him, all creatures here below;\n"
        "praise him above, ye heavenly host;\n"
        "praise Father, Son, and Holy Ghost."
    ),
    notes="Originally the closing stanza of a longer morning hymn written for "
          "students at Winchester College, it became detached and is now sung, often "
          "from memory, more than almost any other four lines in the English "
          "hymnal tradition — the most frequently sung piece of Trinitarian theology "
          "in Protestant history.",
    modern_echo={
        "title": "10,000 Reasons (Bless the Lord)",
        "artist": "Matt Redman",
        "year": 2011,
        "connection": "Both function as compact, repeatable acts of gratitude rooted "
                       "in specific attributes and acts of God rather than vague "
                       "good feeling."
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: MISSION, CALLING & SURRENDER
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-037",
    title="Take My Life, and Let It Be",
    author="Frances Ridley Havergal",
    year=1874,
    public_domain=True,
    era="19th Century Hymnody",
    scripture_anchor="Romans 12:1-2",
    doctrine_tags=["Consecration", "Surrender", "Living Sacrifice"],
    full_text=(
        "Take my life, and let it be\n"
        "consecrated, Lord, to thee;\n"
        "take my moments and my days,\n"
        "let them flow in ceaseless praise."
    ),
    notes="Havergal wrote this in a single sitting after a personal experience of "
          "renewed consecration, working through the body part by part — hands, "
          "feet, voice, silver and gold — in direct echo of Paul's call in Romans 12 "
          "to present the whole body as a living sacrifice.",
    modern_echo={
        "title": "I Surrender",
        "artist": "Hillsong Worship / Jenn Johnson",
        "year": 2016,
        "connection": "Both move through surrender as a deliberate, itemized act "
                       "rather than a vague feeling — naming specific areas of life "
                       "being handed over."
    }
)

add(
    id="hymn-038",
    title="Here I Am, Lord",
    author="Daniel L. Schutte",
    year=1981,
    public_domain=False,
    era="Late 20th Century Hymnody",
    scripture_anchor="Isaiah 6:8; 1 Samuel 3:1-10",
    doctrine_tags=["Calling", "Obedience", "Mission"],
    excerpt="I, the Lord of sea and sky, I have heard my people crying",
    lyrics_link="https://hymnary.org/text/i_the_lord_of_sea_and_sky",
    notes="Widely used across Catholic and Protestant traditions alike, the hymn "
          "voices God's call (drawing on Isaiah 6 and Samuel's call narrative) and "
          "the human response in the same breath — 'here I am, Lord, is it I, Lord?' "
          "— modeling calling as dialogue rather than monologue.",
    modern_echo={
        "title": "Send Me",
        "artist": "Aaron Niequist / Corey Voss",
        "year": 2014,
        "connection": "Both pick up Isaiah's 'here am I, send me' directly, framing "
                       "willingness to be sent as the appropriate response to "
                       "encountering God's holiness and call."
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: PEACE, COMFORT & ASSURANCE
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-039",
    title="Blessed Assurance",
    author="Fanny Crosby",
    year=1873,
    public_domain=True,
    era="19th Century Hymnody",
    scripture_anchor="Romans 8:16; Hebrews 10:22",
    doctrine_tags=["Assurance of Salvation", "Joy", "Witness of the Spirit"],
    full_text=(
        "Blessed assurance, Jesus is mine!\n"
        "Oh, what a foretaste of glory divine!\n"
        "Heir of salvation, purchase of God,\n"
        "born of his Spirit, washed in his blood."
    ),
    notes="Crosby, blind from infancy, wrote over 8,000 hymn texts across her "
          "lifetime. This one was composed in roughly twenty minutes after a friend "
          "played a new tune for her and asked what it said to her — 'blessed "
          "assurance' was her immediate, unrehearsed response.",
    modern_echo={
        "title": "No Longer Slaves",
        "artist": "Bethel Music",
        "year": 2014,
        "connection": "Both rest assurance not in feeling but in declared identity — "
                       "adopted, purchased, no longer what one used to be — regardless "
                       "of present emotional state."
    }
)

add(
    id="hymn-040",
    title="It Is Well (Refrain) — Peace, Perfect Peace",
    author="Edward Henry Bickersteth",
    year=1875,
    public_domain=True,
    era="19th Century Hymnody",
    scripture_anchor="Isaiah 26:3; John 14:27",
    doctrine_tags=["Peace of God", "Assurance", "Trust"],
    full_text=(
        "Peace, perfect peace, in this dark world of sin?\n"
        "The blood of Jesus whispers peace within.\n"
        "Peace, perfect peace, by thronging duties pressed?\n"
        "To do the will of Jesus, this is rest."
    ),
    notes="Structured as a series of questions and answers — each verse names a "
          "specific source of unrest (sin, busyness, loved ones far away, the "
          "approach of death) and answers it directly, rather than offering vague "
          "comfort untethered from real anxieties.",
    modern_echo={
        "title": "Peace Be Still",
        "artist": "Lauren Daigle",
        "year": 2015,
        "connection": "Both speak peace directly into named storms rather than "
                       "around them, addressing fear and chaos with command rather "
                       "than mere reassurance."
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: LAMENT & PENITENCE
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-041",
    title="Just As I Am",
    author="Charlotte Elliott",
    year=1835,
    public_domain=True,
    era="19th Century Hymnody",
    scripture_anchor="Luke 15:11-24; John 6:37",
    doctrine_tags=["Grace", "Invitation", "Coming to Christ"],
    full_text=(
        "Just as I am, without one plea,\n"
        "but that thy blood was shed for me,\n"
        "and that thou bidd'st me come to thee,\n"
        "O Lamb of God, I come, I come."
    ),
    notes="Elliott wrote this as a chronically ill invalid, unable to participate in "
          "her brother's active ministry and wrestling with whether her own faith was "
          "even genuine. The hymn became closely associated with Billy Graham's "
          "altar calls a century later — an invitation hymn written by someone who "
          "needed exactly that invitation herself.",
    modern_echo={
        "title": "Come As You Are",
        "artist": "Crowder",
        "year": 2014,
        "connection": "Both remove every precondition for approaching God — no "
                       "improvement required first, no plea but Christ's own "
                       "sufficiency."
    }
)

add(
    id="hymn-042",
    title="Create in Me a Clean Heart",
    author="Anonymous (Scripture song, Psalm 51)",
    year=1871,
    public_domain=True,
    era="Scripture Song",
    scripture_anchor="Psalm 51:10-12",
    doctrine_tags=["Confession", "Repentance", "Renewal"],
    full_text=(
        "Create in me a clean heart, O God,\n"
        "and renew a right spirit within me.\n"
        "Cast me not away from thy presence, O Lord,\n"
        "and take not thy Holy Spirit from me."
    ),
    notes="A direct musical setting of David's own confession prayer after his sin "
          "with Bathsheba — the church singing David's most exposed and honest words "
          "as its own ongoing prayer, asking not for improvement but for actual "
          "re-creation, the same word used for creation itself.",
    modern_echo={
        "title": "Search My Heart",
        "artist": "Bethel Music",
        "year": 2020,
        "connection": "Both ask God to do the deep, internal work the believer "
                       "cannot do for themselves — invasive, honest prayer rather than "
                       "self-improvement language."
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: HEAVEN, HOPE & THE END
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-043",
    title="When We All Get to Heaven",
    author="Eliza E. Hewitt",
    year=1898,
    public_domain=True,
    era="19th Century Hymnody",
    scripture_anchor="Revelation 21:1-4; 1 Corinthians 13:12",
    doctrine_tags=["Eschatology", "Hope", "Heaven"],
    full_text=(
        "Sing the wondrous love of Jesus,\n"
        "sing his mercy and his grace;\n"
        "in the mansions bright and blessed\n"
        "he'll prepare for us a place."
    ),
    notes="Hewitt wrote prolifically while bedridden for years after a spinal injury, "
          "her hymns consistently turning toward future hope without minimizing "
          "present limitation. This one is exuberant rather than mournful — heaven "
          "anticipated with genuine excitement, not merely as compensation for "
          "present suffering.",
    modern_echo={
        "title": "I Can Only Imagine",
        "artist": "MercyMe",
        "year": 1999,
        "connection": "Both turn toward the same unanswerable question — what will "
                       "it actually be like — with anticipation rather than anxiety, "
                       "imagining unmediated encounter with Christ."
    }
)

add(
    id="hymn-044",
    title="Soon and Very Soon",
    author="Andraé Crouch",
    year=1976,
    public_domain=False,
    era="20th Century Gospel",
    scripture_anchor="Revelation 21:4; Revelation 22:20",
    doctrine_tags=["Eschatology", "Hope", "Joyful Anticipation"],
    excerpt="Soon and very soon, we are going to see the King",
    lyrics_link="https://hymnary.org/text/soon_and_very_soon_we_are_going_to",
    notes="Crouch, a pioneering figure in modern gospel music, wrote this with a "
          "driving, celebratory rhythm explicitly meant to make the return of Christ "
          "feel like imminent, joyful news rather than distant doctrine — 'no more "
          "crying' sung as present-tense anticipation, not abstract future promise.",
    modern_echo={
        "title": "Yes I Will",
        "artist": "Vertical Worship",
        "year": 2018,
        "connection": "Both sustain confident, repeated declaration in the face of "
                       "ongoing waiting, training the heart toward hope through "
                       "repetition rather than argument."
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: CHILDREN'S & SIMPLE FAITH HYMNS (theology in miniature)
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-045",
    title="Jesus Loves Me",
    author="Anna B. Warner (music William B. Bradbury)",
    year=1860,
    public_domain=True,
    era="19th Century Hymnody",
    scripture_anchor="John 13:1; 1 John 4:19",
    doctrine_tags=["Assurance", "Love of God", "Simple Faith"],
    full_text=(
        "Jesus loves me, this I know,\n"
        "for the Bible tells me so;\n"
        "little ones to him belong,\n"
        "they are weak, but he is strong."
    ),
    notes="Originally written as a poem comforting a dying child in a novel before "
          "becoming a hymn in its own right. Reportedly among the last coherent "
          "words spoken by missionary Helen Roseveare and others facing death — "
          "proof that theological simplicity and depth are not opposites.",
    modern_echo={
        "title": "Reckless Love",
        "artist": "Cory Asbury",
        "year": 2017,
        "connection": "Both rest the entire claim of God's love on his character and "
                       "declared word rather than circumstantial evidence — 'this I "
                       "know' answered by a love that 'chases me down.'"
    }
)

add(
    id="hymn-046",
    title="This Little Light of Mine",
    author="Avis B. Christiansen (adapted spiritual)",
    year=1920,
    public_domain=True,
    era="20th Century / Spiritual Adaptation",
    scripture_anchor="Matthew 5:14-16",
    doctrine_tags=["Witness", "Light of the World", "Boldness"],
    full_text=(
        "This little light of mine,\n"
        "I'm going to let it shine.\n"
        "This little light of mine,\n"
        "I'm going to let it shine,\n"
        "let it shine, let it shine, let it shine."
    ),
    notes="Adopted widely during the American civil rights movement as an anthem of "
          "courageous, visible faith under real danger — a children's song that "
          "became, in another context, an act of defiant public testimony, embodying "
          "Jesus's command not to hide one's light under a basket.",
    modern_echo={
        "title": "Shine",
        "artist": "Newsboys / various",
        "year": 1994,
        "connection": "Both treat visible, unhidden faith as a command to obey "
                       "rather than a personality trait some people happen to have."
    }
)

# ════════════════════════════════════════════════════════════════
# ERA: PRAYER, INTERCESSION & DEPENDENCE
# ════════════════════════════════════════════════════════════════

add(
    id="hymn-047",
    title="Sweet Hour of Prayer",
    author="William Walford",
    year=1845,
    public_domain=True,
    era="19th Century Hymnody",
    scripture_anchor="Matthew 6:6; 1 Thessalonians 5:17",
    doctrine_tags=["Prayer", "Communion with God", "Dependence"],
    full_text=(
        "Sweet hour of prayer, sweet hour of prayer,\n"
        "that calls me from a world of care,\n"
        "and bids me at my Father's throne\n"
        "make all my wants and wishes known."
    ),
    notes="Walford was a blind English lay preacher who reportedly composed this "
          "entirely in his head, having it transcribed later by an American visitor "
          "who heard him recite it from memory — a hymn about prayer's intimacy, "
          "itself the product of someone for whom prayer was a primary, undistracted "
          "mode of relating to the world.",
    modern_echo={
        "title": "The War Inside",
        "artist": "Ruth (Ruth Padilla)",
        "year": 2021,
        "connection": "Both frame turning to God in prayer as the necessary escape "
                       "from internal noise and external care rather than an "
                       "occasional religious obligation."
    }
)

add(
    id="hymn-048",
    title="What a Friend We Have in Jesus",
    author="Joseph M. Scriven",
    year=1855,
    public_domain=True,
    era="19th Century Hymnody",
    scripture_anchor="John 15:13-15; Hebrews 4:15-16",
    doctrine_tags=["Friendship with Christ", "Prayer", "Comfort in Trial"],
    full_text=(
        "What a friend we have in Jesus,\n"
        "all our sins and griefs to bear!\n"
        "What a privilege to carry\n"
        "everything to God in prayer!"
    ),
    notes="Scriven wrote this to comfort his mother across the ocean after a series "
          "of personal tragedies, including the drowning death of his fiancée the "
          "night before their wedding. He reportedly never intended it for "
          "publication, considering it private correspondence rather than a hymn.",
    modern_echo={
        "title": "Even If",
        "artist": "MercyMe",
        "year": 2017,
        "connection": "Both were written out of genuine personal grief and loss, "
                       "carrying real weight rather than abstract comfort — friendship "
                       "with Christ tested and affirmed through actual hardship."
    }
)

# ════════════════════════════════════════════════════════════════
# OUTPUT
# ════════════════════════════════════════════════════════════════

output = {
    "name": "HymnTrails Hymn & Song Database",
    "description": "Hymns and Psalm settings spanning church history, each linked to "
                    "scripture, tagged with doctrine, and paired with a contemporary "
                    "(20th/21st century) song that echoes the same theological truth.",
    "lyric_policy": "Full text stored only for hymns confirmed public domain "
                     "(pre-1929 under US copyright law). All others use a short "
                     "attributed excerpt under 15 words plus a lyrics_link to a "
                     "legitimate external source (Hymnary.org, Genius, or official "
                     "publisher).",
    "count": len(HYMNS),
    "hymns": HYMNS,
}

with open("/home/claude/HymnTrails/data/hymns.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Built hymns.json with {len(HYMNS)} entries")

# Quick validation
import collections
eras = collections.Counter(h["era"] for h in HYMNS)
pd_count = sum(1 for h in HYMNS if h["public_domain"])
print(f"Public domain (full text): {pd_count}")
print(f"Copyrighted (excerpt + link): {len(HYMNS) - pd_count}")
print()
print("Era distribution:")
for era, count in eras.most_common():
    print(f"  {era}: {count}")
