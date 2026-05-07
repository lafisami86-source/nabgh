/**
 * Auto-initialize database on app startup
 * This ensures the database is ready even on fresh deployments
 */
import { db } from "./db"
import bcrypt from "bcryptjs"

let initialized = false

export async function ensureDbInitialized() {
  if (initialized) return

  try {
    const userCount = await db.user.count()

    if (userCount === 0) {
      console.log("🔧 Initializing database with seed data...")

      // Create demo user
      const hashedPassword = await bcrypt.hash("123456", 12)
      await db.user.create({
        data: {
          email: "ahmed@test.com",
          name: "أحمد",
          password: hashedPassword,
          role: "STUDENT",
          avatar: "أح",
          plan: "FREE",
          streak: 3,
          xp: 450,
          level: 5,
          country: "ليبيا",
        }
      })

      // Create subjects
      const subjectsData = [
        { name: "الرياضيات", icon: "📐", color: "#6366F1", order: 1 },
        { name: "العلوم", icon: "🔬", color: "#10B981", order: 2 },
        { name: "اللغة العربية", icon: "📖", color: "#8B5CF6", order: 3 },
        { name: "الفيزياء", icon: "⚡", color: "#F59E0B", order: 4 },
        { name: "الإنجليزية", icon: "🌍", color: "#3B82F6", order: 5 },
        { name: "الكيمياء", icon: "🧪", color: "#EC4899", order: 6 },
        { name: "التربية الإسلامية", icon: "🕌", color: "#06B6D4", order: 7 },
        { name: "الاجتماعيات", icon: "🗺️", color: "#F97316", order: 8 },
      ]
      const subjects = await Promise.all(
        subjectsData.map(s => db.subject.create({ data: s }))
      )

      // Create lessons
      const lessonsData = [
        { subjectIdx: 0, title: "الأعداد الصحيحة", description: "تعرف على الأعداد الصحيحة وخصائصها وعملياتها الأساسية", content: "الأعداد الصحيحة هي مجموعة الأعداد التي تشمل الأعداد الطبيعية وأعدام الصفر والأعداد السالبة.", order: 1, difficulty: "BEGINNER" as const, duration: 30 },
        { subjectIdx: 0, title: "الكسور والعمليات عليها", description: "تعلم الكسور العادية وأنواعها وكيفية إجراء العمليات الحسابية عليها", content: "الكسر هو عدد يُعبَّر عنه كنسبة بين عددين: البسط والمقام.", order: 2, difficulty: "BEGINNER" as const, duration: 35 },
        { subjectIdx: 0, title: "المعادلات الخطية", description: "حل المعادلات الخطية بمتغير واحد وبمتحولين", content: "المعادلة الخطية هي معادلة من الدرجة الأولى.", order: 3, difficulty: "INTERMEDIATE" as const, duration: 40 },
        { subjectIdx: 1, title: "الخلية: وحدة بناء الكائن الحي", description: "اكتشف تركيب الخلية ومكوناتها الأساسية ووظائفها", content: "الخلية هي الوحدة البنائية والوظيفية الأساسية في الكائنات الحية.", order: 1, difficulty: "BEGINNER" as const, duration: 25 },
        { subjectIdx: 1, title: "التفاعلات الكيميائية", description: "فهم التفاعلات الكيميائية وأنواعها وقوانينها", content: "التفاعل الكيميائي هو عملية تتحول فيها مواد إلى مواد جديدة.", order: 2, difficulty: "INTERMEDIATE" as const, duration: 35 },
        { subjectIdx: 1, title: "القوة والحركة", description: "دراسة القوى وتأثيرها على حركة الأجسام وقوانين نيوتن", content: "القوة هي مؤثر يغيّر من حالة الجسم الساكن أو المتحرك.", order: 3, difficulty: "INTERMEDIATE" as const, duration: 40 },
        { subjectIdx: 2, title: "الأسماء والأفعال والحروف", description: "تمييز الأسماء والأفعال والحروف ومعرفة علامات كل نوع", content: "الكلمة في اللغة العربية تنقسم إلى ثلاثة أنواع: الاسم والفعل والحرف.", order: 1, difficulty: "BEGINNER" as const, duration: 25 },
        { subjectIdx: 2, title: "الجملة الاسمية والفعلية", description: "بناء الجملة العربية وتحليل مكوناتها الأساسية", content: "الجملة في اللغة العربية نوعان: اسمية وفعلية.", order: 2, difficulty: "BEGINNER" as const, duration: 30 },
        { subjectIdx: 2, title: "البلاغة: التشبيه والاستعارة", description: "فهم أساليب البلاغة العربية وأهميتها في التعبير", content: "البلاغة هي مطابقة الكلام لمقتضى الحال.", order: 3, difficulty: "ADVANCED" as const, duration: 40 },
        { subjectIdx: 3, title: "الحركة والسرعة", description: "دراسة مفهوم الحركة وأنواعها وحساب السرعة والتسارع", content: "الحركة هي تغيّر موقع الجسم بالنسبة لنقطة مرجعية بمرور الزمن.", order: 1, difficulty: "BEGINNER" as const, duration: 30 },
        { subjectIdx: 3, title: "الطاقة وتحولاتها", description: "فهم أنواع الطاقة ومبدأ حفظ الطاقة وتحولاتها", content: "الطاقة هي القدرة على القيام بشغل أو إحداث تغيير.", order: 2, difficulty: "INTERMEDIATE" as const, duration: 35 },
        { subjectIdx: 4, title: "Basic Grammar: Tenses", description: "Learn the basic English tenses and how to use them correctly", content: "English tenses are divided into three main categories: Present, Past, and Future.", order: 1, difficulty: "BEGINNER" as const, duration: 30 },
        { subjectIdx: 4, title: "Vocabulary: Daily Life", description: "Essential English vocabulary for everyday situations", content: "Building a strong vocabulary is essential for English fluency.", order: 2, difficulty: "BEGINNER" as const, duration: 25 },
        { subjectIdx: 4, title: "Conversation Skills", description: "Practice English conversation with common phrases", content: "Good conversation skills help you communicate effectively.", order: 3, difficulty: "INTERMEDIATE" as const, duration: 35 },
        { subjectIdx: 5, title: "الذرة والعناصر", description: "فهم تركيب الذرة والعناصر الكيميائية والجدول الدوري", content: "الذرة هي أصغر وحدة بنائية للعنصر الكيميائي.", order: 1, difficulty: "BEGINNER" as const, duration: 30 },
        { subjectIdx: 5, title: "الروابط الكيميائية", description: "أنواع الروابط الكيميائية وخصائص كل نوع", content: "الرابطة الكيميائية هي قوة تجاذب بين ذرتين أو أكثر.", order: 2, difficulty: "INTERMEDIATE" as const, duration: 35 },
        { subjectIdx: 6, title: "أركان الإسلام", description: "تعرف على أركان الإسلام الخمسة ومعنى كل ركن", content: "أركان الإسلام خمسة هي أساس الدين الإسلامي.", order: 1, difficulty: "BEGINNER" as const, duration: 25 },
        { subjectIdx: 6, title: "أخلاق المسلم", description: "القيم والأخلاق الإسلامية وأهميتها في حياة المسلم", content: "حثّ الإسلام على مكارم الأخلاق وحسن التعامل.", order: 2, difficulty: "BEGINNER" as const, duration: 20 },
        { subjectIdx: 7, title: "جغرافية الوطن العربي", description: "موقع الوطن العربي وتضاريسه ومناخه وموارده الطبيعية", content: "يمتد الوطن العربي من المحيط الأطلسي غرباً إلى الخليج العربي شرقاً.", order: 1, difficulty: "BEGINNER" as const, duration: 30 },
        { subjectIdx: 7, title: "تاريخ الحضارة الإسلامية", description: "نظرة عامة على تاريخ الحضارة الإسلامية وإنجازاتها", content: "الحضارة الإسلامية من أعظم الحضارات في تاريخ البشرية.", order: 2, difficulty: "INTERMEDIATE" as const, duration: 35 },
      ]

      const lessons = await Promise.all(
        lessonsData.map(l => db.lesson.create({
          data: {
            title: l.title,
            description: l.description,
            content: l.content,
            subjectId: subjects[l.subjectIdx].id,
            order: l.order,
            difficulty: l.difficulty,
            duration: l.duration,
          }
        }))
      )

      // Create achievements
      const achievementsData = [
        { name: "البداية المشرقة", description: "أكمل أول درس لك في المنصة", icon: "🌟", category: "progress", requirement: 1 },
        { name: "المتعلم النشيط", description: "أكمل 5 دروس في مختلف المواد", icon: "📚", category: "progress", requirement: 5 },
        { name: "نجم الرياضيات", description: "أكمل 10 تمارين في مادة الرياضيات", icon: "🔢", category: "subject", requirement: 10 },
        { name: "عالم المستقبل", description: "أكمل 10 تمارين في مادة العلوم", icon: "🔬", category: "subject", requirement: 10 },
        { name: "أديب اللغة", description: "أكمل 10 تمارين في مادة اللغة العربية", icon: "✍️", category: "subject", requirement: 10 },
        { name: "الساحل المتواصل", description: "حقق سلسلة تعلم لمدة 7 أيام متتالية", icon: "🔥", category: "streak", requirement: 7 },
        { name: "بطل الأسئلة", description: "أجب على 50 سؤالاً بشكل صحيح", icon: "🏆", category: "exercise", requirement: 50 },
        { name: "العبقري", description: "حقق مستوى 10 في المنصة", icon: "🧠", category: "level", requirement: 10 },
      ]
      await Promise.all(
        achievementsData.map(a => db.achievement.create({ data: a }))
      )

      // Create flashcards
      const flashcardsData = [
        { front: "ما ناتج (-3) × (-7)؟", back: "21 - حاصل ضرب عددين سالبين موجب", subject: "الرياضيات" },
        { front: "ما هي وحدة بناء الكائن الحي؟", back: "الخلية - هي أصغر وحدة بنائية ووظيفية في الكائن الحي", subject: "العلوم" },
        { front: "ما علامات الاسم؟", back: "التنوين، الألف واللام، حرف الجر، الإسناد إليه", subject: "اللغة العربية" },
        { front: "ما القانون الثاني لنيوتن؟", back: "القوة = الكتلة × التسارع (F = ma)", subject: "الفيزياء" },
        { front: "What is the Past Simple of 'go'?", back: "Went - The past simple of 'go' is 'went' (irregular verb)", subject: "الإنجليزية" },
        { front: "ما الفرق بين الرابطة الأيونية والتساهمية؟", back: "الأيونية: انتقال إلكترونات. التساهمية: مشاركة إلكترونات", subject: "الكيمياء" },
        { front: "ما أركان الإسلام الخمسة؟", back: "الشهادتان، الصلاة، الزكاة، الصوم، الحج", subject: "التربية الإسلامية" },
        { front: "ما أهمية موقع الوطن العربي؟", back: "يربط بين ثلاث قارات ويتحكم في مضائق بحرية مهمة", subject: "الاجتماعيات" },
        { front: "ما هو الكسر المختلط؟", back: "عدد يتكون من عدد صحيح وكسر عادي، مثل: 2 و 1/3", subject: "الرياضيات" },
        { front: "ما هي وظيفة الميتوكندريا؟", back: "إنتاج الطاقة (ATP) من خلال عملية التنفس الخلوي", subject: "العلوم" },
      ]
      await Promise.all(
        flashcardsData.map(f => db.flashcard.create({
          data: { front: f.front, back: f.back, subject: f.subject, userId: null }
        }))
      )

      console.log("✅ Database initialized successfully!")
    }

    initialized = true
  } catch (error) {
    console.error("❌ Database initialization error:", error)
    // Don't throw - let the app continue, the seed route can be called manually
  }
}
