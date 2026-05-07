import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    // Check if data already exists
    const existingSubjects = await db.subject.count()
    if (existingSubjects > 0) {
      return NextResponse.json({
        message: "البيانات موجودة بالفعل",
        counts: {
          subjects: existingSubjects,
        }
      })
    }

    // ─── Seed Demo User ──────────────────────────────────
    const existingUser = await db.user.findUnique({ where: { email: "ahmed@test.com" } })
    if (!existingUser) {
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
    }

    // ─── Seed Subjects ─────────────────────────────────────
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

    // ─── Seed Lessons ──────────────────────────────────────
    const lessonsData = [
      // الرياضيات
      { subjectIdx: 0, title: "الأعداد الصحيحة", description: "تعرف على الأعداد الصحيحة وخصائصها وعملياتها الأساسية", content: "الأعداد الصحيحة هي مجموعة الأعداد التي تشمل الأعداد الطبيعية (1, 2, 3, ...) وأعدام الصفر (0) والأعداد السالبة (-1, -2, -3, ...).\n\n## خصائص الأعداد الصحيحة\n- عملية الجمع: تكون النتيجة عدد صحيح\n- عملية الطرح: تكون النتيجة عدد صحيح\n- عملية الضرب: تكون النتيجة عدد صحيح\n- عملية القسمة: قد لا تكون النتيجة عدد صحيح", order: 1, difficulty: "BEGINNER" as const, duration: 30 },
      { subjectIdx: 0, title: "الكسور والعمليات عليها", description: "تعلم الكسور العادية وأنواعها وكيفية إجراء العمليات الحسابية عليها", content: "الكسر هو عدد يُعبَّر عنه كنسبة بين عددين: البسط والمقام.\n\n## أنواع الكسور\n- كسر عادي: بسطه أصغر من مقامه\n- كسر غير عادي: بسطه أكبر من أو يساوي مقامه\n- كسر مختلط: يتكون من عدد صحيح وكسر عادي\n\n## عمليات الكسور\n- الجمع والطرح: توحيد المقامات أولاً\n- الضرب: ضرب البسط في البسط والمقام في المقام\n- القسمة: قلب الكسر الثاني ثم الضرب", order: 2, difficulty: "BEGINNER" as const, duration: 35 },
      { subjectIdx: 0, title: "المعادلات الخطية", description: "حل المعادلات الخطية بمتغير واحد وبمتحولين", content: "المعادلة الخطية هي معادلة من الدرجة الأولى.\n\n## معادلة بمتغير واحد\nالصورة العامة: ax + b = 0\nالحل: x = -b/a\n\n## معادلة بمتحولين\nالصورة العامة: ax + by = c\nتمثيلها البياني هو خط مستقيم", order: 3, difficulty: "INTERMEDIATE" as const, duration: 40 },

      // العلوم
      { subjectIdx: 1, title: "الخلية: وحدة بناء الكائن الحي", description: "اكتشف تركيب الخلية ومكوناتها الأساسية ووظائفها", content: "الخلية هي الوحدة البنائية والوظيفية الأساسية في الكائنات الحية.\n\n## مكونات الخلية\n- الغشاء البلازمي: يحيط بالخلية وينظم دخول وخروج المواد\n- السيتوبلازم: المادة الهلامية داخل الخلية\n- النواة: مركز التحكم في الخلية\n- الميتوكندريا: محطة الطاقة في الخلية\n\n## أنواع الخلايا\n- خلية نباتية: لها جدار خلوي وبلاستيدات خضراء\n- خلية حيوانية: ليس لها جدار خلوي", order: 1, difficulty: "BEGINNER" as const, duration: 25 },
      { subjectIdx: 1, title: "التفاعلات الكيميائية", description: "فهم التفاعلات الكيميائية وأنواعها وقوانينها", content: "التفاعل الكيميائي هو عملية تتحول فيها مواد (المتفاعلات) إلى مواد جديدة (النواتج).\n\n## أنواع التفاعلات\n- تفاعل الاتحاد: مادتان تتحدان لتكوين مادة واحدة\n- تفاعل التفكك: مادة تتفكك إلى مادتين أو أكثر\n- تفاعل الإحلال: عنصر يحل محل آخر في مركب\n\n## قانون حفظ الكتلة\nكتلة المتفاعلات = كتلة النواتج", order: 2, difficulty: "INTERMEDIATE" as const, duration: 35 },
      { subjectIdx: 1, title: "القوة والحركة", description: "دراسة القوى وتأثيرها على حركة الأجسام وقوانين نيوتن", content: "القوة هي مؤثر يغيّر من حالة الجسم الساكن أو المتحرك.\n\n## قوانين نيوتن\n1. القانون الأول: الجسم الساكن يبقى ساكناً والمتحرك يبقى متحركاً ما لم تؤثر عليه قوة خارجية\n2. القانون الثاني: القوة = الكتلة × التسارع (F = ma)\n3. القانون الثالث: لكل فعل رد فعل مساوٍ له في المقدار ومعاكس في الاتجاه", order: 3, difficulty: "INTERMEDIATE" as const, duration: 40 },

      // اللغة العربية
      { subjectIdx: 2, title: "ال名词 والأفعال", description: "تمييز الأسماء والأفعال والحروف ومعرفة علامات كل نوع", content: "الكلمة في اللغة العربية تنقسم إلى ثلاثة أنواع:\n\n## الاسم\nهو كلمة تدل على معنى في نفسها غير مقترنة بزمن\n- علاماته: التنوين، الألف واللام، حرف الجر\n- أمثلة: كتابٌ، القلم، في البيتِ\n\n## الفعل\nهو كلمة تدل على حدث مقترن بزمن\n- الماضي: كتبَ\n- المضارع: يكتبُ\n- الأمر: اكتُبْ\n\n## الحرف\nهو كلمة لا يظهر معناها إلا مع غيرها\n- أمثلة: في، من، إلى، على", order: 1, difficulty: "BEGINNER" as const, duration: 25 },
      { subjectIdx: 2, title: "الجملة الاسمية والفعلية", description: "بناء الجملة العربية وتحليل مكوناتها الأساسية", content: "الجملة في اللغة العربية نوعان:\n\n## الجملة الاسمية\nتبدأ باسم وتتكون من مبتدأ وخبر\n- المبتدأ: اسم مرفوع تبدأ به الجملة\n- الخبر: اسم مرفوع يكمل معنى المبتدأ\n- مثال: العلمُ نورٌ\n\n## الجملة الفعلية\nتبدأ بفعل وتتكون من فعل وفاعل ومفعول به (أحياناً)\n- الفعل: حدث مقترن بزمن\n- الفاعل: اسم مرفوع قام بالفعل\n- المفعول به: اسم منصوب وقع عليه فعل الفاعل\n- مثال: قرأ الطالبُ الكتابَ", order: 2, difficulty: "BEGINNER" as const, duration: 30 },
      { subjectIdx: 2, title: "البلاغة: التشبيه والاستعارة", description: "فهم أساليب البلاغة العربية وأهميتها في التعبير", content: "البلاغة هي مطابقة الكلام لمقتضى الحال.\n\n## التشبيه\nهو عقد مشاركة بين شيئين في صفة أو أكثر بأداة تشبيه\n- أركانه: المشبه، المشبه به، أداة التشبيه، وجه الشبه\n- مثال: العلمُ كالنورِ يهدي الناس\n\n## الاستعارة\nهي تشبيه حذف أحد طرفيه مع الإبقاء على قرينة تدل عليه\n- استعارة تصريحية: حُذف المشبه وصُرّح بالمشبه به\n- استعارة مكنية: حُذف المشبه به ورُمز إليه\n- مثال: قال تعالى \"جداراً يريد أن ينقضّ\"", order: 3, difficulty: "ADVANCED" as const, duration: 40 },

      // الفيزياء
      { subjectIdx: 3, title: "الحركة والسرعة", description: "دراسة مفهوم الحركة وأنواعها وحساب السرعة والتسارع", content: "الحركة هي تغيّر موقع الجسم بالنسبة لنقطة مرجعية بمرور الزمن.\n\n## أنواع الحركة\n- حركة منتظمة: سرعة ثابتة\n- حركة متسارعة: سرعة متزايدة\n- حركة متباطئة: سرعة متناقصة\n\n## القوانين الأساسية\n- السرعة = المسافة ÷ الزمن (v = d/t)\n- التسارع = تغيّر السرعة ÷ الزمن (a = Δv/Δt)\n- المسافة = السرعة × الزمن (d = v × t)", order: 1, difficulty: "BEGINNER" as const, duration: 30 },
      { subjectIdx: 3, title: "الطاقة وتحولاتها", description: "فهم أنواع الطاقة ومبدأ حفظ الطاقة وتحولاتها", content: "الطاقة هي القدرة على القيام بشغل أو إحداث تغيير.\n\n## أنواع الطاقة\n- طاقة حركية: طاقة الأجسام المتحركة\n- طاقة وضع: طاقة مخزنة بسبب الموقع\n- طاقة حرارية: طاقة حركة الجزيئات\n- طاقة كهربائية: طاقة الشحنات المتحركة\n\n## مبدأ حفظ الطاقة\nالطاقة لا تُفنى ولا تُستحدث، بل تتحول من شكل إلى آخر\n- مثال: طاقة وضع → طاقة حركية → طاقة حرارية", order: 2, difficulty: "INTERMEDIATE" as const, duration: 35 },

      // الإنجليزية
      { subjectIdx: 4, title: "Basic Grammar: Tenses", description: "Learn the basic English tenses and how to use them correctly", content: "English tenses are divided into three main categories:\n\n## Present Tenses\n- Simple Present: I study every day\n- Present Continuous: I am studying now\n- Present Perfect: I have studied the lesson\n\n## Past Tenses\n- Simple Past: I studied yesterday\n- Past Continuous: I was studying when you called\n\n## Future Tenses\n- Simple Future: I will study tomorrow\n- Future Continuous: I will be studying at 8 PM", order: 1, difficulty: "BEGINNER" as const, duration: 30 },
      { subjectIdx: 4, title: "Vocabulary: Daily Life", description: "Essential English vocabulary for everyday situations and conversations", content: "Building a strong vocabulary is essential for English fluency.\n\n## Greetings & Introductions\n- Hello / Hi / Good morning\n- How are you? / I'm fine, thank you\n- Nice to meet you\n\n## At School\n- Classroom / Teacher / Student\n- Homework / Exam / Grade\n- Library / Subject / Lesson\n\n## Daily Activities\n- Wake up / Have breakfast / Go to school\n- Study / Play / Sleep\n- Read / Write / Speak", order: 2, difficulty: "BEGINNER" as const, duration: 25 },
      { subjectIdx: 4, title: "Conversation Skills", description: "Practice English conversation with common phrases and dialogues", content: "Good conversation skills help you communicate effectively.\n\n## Asking Questions\n- What is your name? / My name is...\n- Where are you from? / I'm from...\n- How old are you? / I'm... years old\n\n## Expressing Opinions\n- I think that... / In my opinion...\n- I agree / I disagree\n- That's a good point\n\n## Making Requests\n- Could you help me, please?\n- Can I borrow your book?\n- Would you mind opening the window?", order: 3, difficulty: "INTERMEDIATE" as const, duration: 35 },

      // الكيمياء
      { subjectIdx: 5, title: "ذرّة والعناصر", description: "فهم تركيب الذرة والعناصر الكيميائية والجدول الدوري", content: "الذرة هي أصغر وحدة بنائية للعنصر الكيميائي.\n\n## تركيب الذرة\n- النواة: تحتوي على بروتونات (موجبة) ونيوترونات (متعادلة)\n- الإلكترونات: جسيمات سالبة تدور حول النواة\n\n## العدد الذري والكتلي\n- العدد الذري = عدد البروتونات\n- العدد الكتلي = بروتونات + نيوترونات\n\n## الجدول الدوري\n- العناصر مرتبة حسب عددها الذري\n- المجموعة (عمود): عناصر لها خصائص كيميائية متشابهة\n- الدورة (صف): عناصر لها نفس عدد مستويات الطاقة", order: 1, difficulty: "BEGINNER" as const, duration: 30 },
      { subjectIdx: 5, title: "الروابط الكيميائية", description: "أنواع الروابط الكيميائية وخصائص كل نوع", content: "الرابطة الكيميائية هي قوة تجاذب بين ذرتين أو أكثر.\n\n## الروابط الأيونية\n- تحدث بين فلز ولا فلز\n- انتقال إلكترونات من فلز إلى لا فلز\n- مثال: كلوريد الصوديوم (NaCl)\n\n## الروابط التساهمية\n- تحدث بين ذرتين لا فلزيتين\n- مشاركة إلكترونات بين الذرتين\n- مثال: جزيء الماء (H₂O)\n\n## الروابط الفلزية\n- تحدث بين ذرات الفلزات\n- بحر من الإلكترونات الحرة", order: 2, difficulty: "INTERMEDIATE" as const, duration: 35 },

      // التربية الإسلامية
      { subjectIdx: 6, title: "أركان الإسلام", description: "تعرف على أركان الإسلام الخمسة ومعنى كل ركن", content: "أركان الإسلام خمسة هي أساس الدين الإسلامي.\n\n## الشهادتان\n- شهادة أن لا إله إلا الله وأن محمداً رسول الله\n- هي مفتاح الدخول في الإسلام\n\n## الصلاة\n- خمس صلوات مفروضة في اليوم والليلة\n- الفجر والظهر والعصر والمغرب والعشاء\n\n## الزكاة\n- حق مالي يجب في أموال محددة\n- تُدفع لمستحقيها من الفقراء والمساكين\n\n## الصوم\n- صوم شهر رمضان المبارك\n- الامتناع عن الطعام والشراب من الفجر إلى المغرب\n\n## الحج\n- فريضة لمرة واحدة في العمر لمن استطاع\n- إلى بيت الله الحرام في مكة المكرمة", order: 1, difficulty: "BEGINNER" as const, duration: 25 },
      { subjectIdx: 6, title: "أخلاق المسلم", description: "القيم والأخلاق الإسلامية وأهميتها في حياة المسلم", content: "حثّ الإسلام على مكارم الأخلاق وحسن التعامل.\n\n## الصدق\n- الصدق منجاة وهو أساس الثقة\n- قال صلى الله عليه وسلم: \"عليكم بالصدق\"\n\n## الأمانة\n- أداء الحقوق إلى أهلها\n- حفظ ما اؤتمن عليه الإنسان\n\n## بر الوالدين\n- طاعتهما في غير معصية الله\n- الإحسان إليهما والتواضع لهما\n\n## العفو والتسامح\n- العفو عند المقدرة من شيم الكرام\n- التسامح يزرع المحبة في القلوب", order: 2, difficulty: "BEGINNER" as const, duration: 20 },

      // الاجتماعيات
      { subjectIdx: 7, title: "جغرافية الوطن العربي", description: "موقع الوطن العربي وتضاريسه ومناخه وموارده الطبيعية", content: "يمتد الوطن العربي من المحيط الأطلسي غرباً إلى الخليج العربي شرقاً.\n\n## الموقع\n- يربط بين ثلاث قارات: آسيا وأفريقيا وأوروبا\n- يطل على البحر المتوسط والبحر الأحمر والمحيط الأطلسي\n\n## التضاريس\n- سهول ساحلية على البحر المتوسط\n- هضاب داخلية مثل هضبة نجد\n- صحراء الربع الخالي وصحراء الصحراء الكبرى\n- أودية أنهار كنهر النيل ونهر الفرات\n\n## المناخ\n- مناخ متوسطي في الشمال\n- منخفض صحراوي في الوسط والجنوب", order: 1, difficulty: "BEGINNER" as const, duration: 30 },
      { subjectIdx: 7, title: "تاريخ الحضارة الإسلامية", description: "نظرة عامة على تاريخ الحضارة الإسلامية وإنجازاتها", content: "الحضارة الإسلامية من أعظم الحضارات في تاريخ البشرية.\n\n## العصر النبوي\n- بعثة النبي محمد صلى الله عليه وسلم\n- تأسيس الدولة الإسلامية في المدينة المنورة\n\n## العصر الراشدي\n- توسع الفتوحات الإسلامية\n- إنشاء نظام الحكم الشورى\n\n## الإنجازات الحضارية\n- العلوم: الجبر والطب والفلك\n- العمارة: المساجد والقصور\n- الأدب: الشعر والنثر\n- الترجمة: نقل العلم اليوناني والفارسي", order: 2, difficulty: "INTERMEDIATE" as const, duration: 35 },
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

    // ─── Seed Exercises ────────────────────────────────────
    const exercisesData = [
      // الرياضيات - الأعداد الصحيحة
      { lessonIdx: 0, question: "ما ناتج جمع (-5) + (-3)؟", options: JSON.stringify(["-8", "-2", "2", "8"]), correctAnswer: 0, explanation: "عند جمع عددين سالبين، نجمع قيمتيهما المطلقتين ونضع إشارة السالب: 5 + 3 = 8، إذن الناتج -8", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 0, question: "أي من الأعداد التالية ليس عدداً صحيحاً؟", options: JSON.stringify(["0", "-7", "3.5", "12"]), correctAnswer: 2, explanation: "3.5 ليس عدداً صحيحاً لأن الأعداد الصحيحة لا تحتوي على كسور أو أجزاء عشرية", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 0, question: "ما ناتج ضرب (-4) × 6؟", options: JSON.stringify(["24", "-24", "-10", "10"]), correctAnswer: 1, explanation: "عند ضرب عدد سالب في عدد موجب، يكون الناتج سالباً: 4 × 6 = 24، إذن -4 × 6 = -24", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 0, question: "العدد المعاكس لـ (-9) هو 9", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 0, explanation: "العدد المعاكس لأي عدد هو العدد الذي مجموعهما يساوي صفراً. -9 + 9 = 0، إذن العدد المعاكس لـ (-9) هو 9", difficulty: "BEGINNER" as const, type: "TRUE_FALSE" as const },

      // الرياضيات - الكسور
      { lessonIdx: 1, question: "ما ناتج جمع 1/3 + 1/6؟", options: JSON.stringify(["2/9", "1/2", "2/6", "1/3"]), correctAnswer: 1, explanation: "نوحّد المقامات: 1/3 = 2/6، ثم نجمع: 2/6 + 1/6 = 3/6 = 1/2", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 1, question: "الكسر 7/4 هو كسر عادي", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 1, explanation: "الكسر العادي بسطه أصغر من مقامه. هنا 7 > 4، إذن هو كسر غير عادي (أو كسر أكبر من الواحد)", difficulty: "BEGINNER" as const, type: "TRUE_FALSE" as const },
      { lessonIdx: 1, question: "ما ناتج ضرب 2/5 × 3/4؟", options: JSON.stringify(["6/20", "5/9", "6/9", "1/2"]), correctAnswer: 0, explanation: "نضرب البسط في البسط والمقام في المقام: (2×3)/(5×4) = 6/20 = 3/10", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },

      // الرياضيات - المعادلات الخطية
      { lessonIdx: 2, question: "ما حل المعادلة 2x + 6 = 14؟", options: JSON.stringify(["x = 4", "x = 10", "x = 3", "x = 8"]), correctAnswer: 0, explanation: "2x + 6 = 14 → 2x = 14 - 6 → 2x = 8 → x = 8/2 → x = 4", difficulty: "INTERMEDIATE" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 2, question: "إذا كان 3x - 9 = 0، فما قيمة x؟", options: JSON.stringify(["0", "3", "9", "-3"]), correctAnswer: 1, explanation: "3x - 9 = 0 → 3x = 9 → x = 9/3 → x = 3", difficulty: "INTERMEDIATE" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 2, question: "المعادلة 5x = 25 لها حل واحد فقط", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 0, explanation: "نعم، المعادلة الخطية بمتغير واحد لها حل واحد فقط: 5x = 25 → x = 5", difficulty: "INTERMEDIATE" as const, type: "TRUE_FALSE" as const },

      // العلوم - الخلية
      { lessonIdx: 3, question: "ما هو مركز التحكم في الخلية؟", options: JSON.stringify(["الغشاء البلازمي", "النواة", "الميتوكندريا", "السيتوبلازم"]), correctAnswer: 1, explanation: "النواة هي مركز التحكم في الخلية لأنها تحتوي على المادة الوراثية (DNA) وتتحكم في جميع نشاطات الخلية", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 3, question: "الخلية النباتية تحتوي على جدار خلوي بينما الخلية الحيوانية لا تحتوي", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 0, explanation: "صحيح! الجدار الخلوي من أهم الفروق بين الخلية النباتية والحيوانية، وهو يعطي الخلية النباتية شكلاً ثابتاً", difficulty: "BEGINNER" as const, type: "TRUE_FALSE" as const },
      { lessonIdx: 3, question: "أين تتم عملية التنفس الخلوي؟", options: JSON.stringify(["النواة", "الغشاء البلازمي", "الميتوكندريا", "الريبوسومات"]), correctAnswer: 2, explanation: "الميتوكندريا هي محطة الطاقة في الخلية حيث تتم عملية التنفس الخلوي لإنتاج الطاقة (ATP)", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },

      // العلوم - التفاعلات الكيميائية
      { lessonIdx: 4, question: "وفق قانون حفظ الكتلة، إذا تفاعل 10 غرام من الهيدروجين مع 80 غرام من الأكسجين، فما كتلة الماء الناتج؟", options: JSON.stringify(["70 غرام", "80 غرام", "90 غرام", "100 غرام"]), correctAnswer: 2, explanation: "وفق قانون حفظ الكتلة: كتلة المتفاعلات = كتلة النواتج. 10 + 80 = 90 غرام", difficulty: "INTERMEDIATE" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 4, question: "في تفاعل الإحلال، يحل عنصر محل عنصر آخر في مركب", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 0, explanation: "صحيح! تفاعل الإحلال هو أن يحل عنصر نشط محل عنصر أقل نشاطاً في المركب", difficulty: "INTERMEDIATE" as const, type: "TRUE_FALSE" as const },

      // العلوم - القوة والحركة
      { lessonIdx: 5, question: "وفق القانون الثاني لنيوتن، إذا كانت القوة 20 نيوتن والكتلة 5 كغ، فما التسارع؟", options: JSON.stringify(["4 م/ث²", "25 م/ث²", "100 م/ث²", "15 م/ث²"]), correctAnswer: 0, explanation: "F = ma → a = F/m = 20/5 = 4 م/ث²", difficulty: "INTERMEDIATE" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 5, question: "لكل فعل رد فعل مساوٍ له في المقدار ومعاكس في الاتجاه - هذا القانون الثالث لنيوتن", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 0, explanation: "صحيح! هذا هو نص القانون الثالث لنيوتن بالضبط، ومثال ذلك: عند دفع الحائط، الحائط يدفعك بنفس القوة", difficulty: "INTERMEDIATE" as const, type: "TRUE_FALSE" as const },

      // اللغة العربية - الأسماء والأفعال
      { lessonIdx: 6, question: "أي من الكلمات التالية فعل؟", options: JSON.stringify(["كتاب", "كتبَ", "مكتبة", "كاتب"]), correctAnswer: 1, explanation: "كتبَ فعل ماضٍ لأنه يدل على حدث مقترن بزمن الماضي. باقي الكلمات أسماء لا تدل على زمن", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 6, question: "التنوين من علامات الاسم", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 0, explanation: "صحيح! التنوين (الضمتان، الفتحتان، الكسرتان) من علامات الاسم في اللغة العربية", difficulty: "BEGINNER" as const, type: "TRUE_FALSE" as const },
      { lessonIdx: 6, question: "ما نوع الكلمة \"في\"؟", options: JSON.stringify(["اسم", "فعل", "حرف", "فعل أمر"]), correctAnswer: 2, explanation: "\"في\" حرف جر، والحرف لا يظهر معناه إلا مع غيره. \"في\" تدل على الظرفية المكانية", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },

      // اللغة العربية - الجملة الاسمية والفعلية
      { lessonIdx: 7, question: "ما نوع الجملة: \"الطالبُ مجتهدٌ\"؟", options: JSON.stringify(["جملة فعلية", "جملة اسمية", "شبه جملة", "جملة شرطية"]), correctAnswer: 1, explanation: "الجملة اسمية لأنها تبدأ باسم (الطالبُ) وهو المبتدأ، ومجتهدٌ هو الخبر", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 7, question: "في الجملة \"قرأ الولدُ القصةَ\"، المفعول به هو: القصةَ", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 0, explanation: "صحيح! القصةَ هي المفعول به لأنها اسم منصوب وقع عليه فعل الفاعل (قرأ)", difficulty: "BEGINNER" as const, type: "TRUE_FALSE" as const },

      // اللغة العربية - البلاغة
      { lessonIdx: 8, question: "ما نوع التشبيه في: \"وجهها كالقمر\"؟", options: JSON.stringify(["تشبيه تمثيلي", "تشبيه مجمل", "تشبيه مفصل", "تشبيه بليغ"]), correctAnswer: 2, explanation: "تشبيه مفصل لأنه ذُكرت أركانه الأربعة: المشبه (وجهها)، أداة التشبيه (الكاف)، المشبه به (القمر)، ووجه الشبه مفهوم (الجمال والإشراق)", difficulty: "ADVANCED" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 8, question: "في قوله تعالى \"جداراً يريد أن ينقضّ\"، نوع الاستعارة هو: استعارة مكنية", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 0, explanation: "صحيح! استعارة مكنية لأن الجدار شُبّه بإنسان يريد (حُذف المشبه به وهو الإنسان ورُمز إليه بصفة من صفاته وهي الإرادة)", difficulty: "ADVANCED" as const, type: "TRUE_FALSE" as const },

      // الفيزياء - الحركة والسرعة
      { lessonIdx: 9, question: "سيارة قطعت 120 كم في ساعتين، ما سرعتها المتوسطة؟", options: JSON.stringify(["60 كم/س", "240 كم/س", "120 كم/س", "30 كم/س"]), correctAnswer: 0, explanation: "السرعة = المسافة ÷ الزمن = 120 ÷ 2 = 60 كم/ساعة", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 9, question: "إذا كانت سرعة الدراجة 10 م/ث وزمن الحركة 30 ثانية، ما المسافة المقطوعة؟", options: JSON.stringify(["300 م", "3 م", "3000 م", "30 م"]), correctAnswer: 0, explanation: "المسافة = السرعة × الزمن = 10 × 30 = 300 متر", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },

      // الفيزياء - الطاقة
      { lessonIdx: 10, question: "ما نوع الطاقة المخزنة في البطارية؟", options: JSON.stringify(["طاقة حركية", "طاقة كهربائية كامنة", "طاقة حرارية", "طاقة نووية"]), correctAnswer: 1, explanation: "البطارية تخزن طاقة كهربائية كامنة (وضع) تتحول إلى طاقة كهربائية متدفقة عند توصيل الدائرة", difficulty: "INTERMEDIATE" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 10, question: "حسب مبدأ حفظ الطاقة، الطاقة يمكن أن تُفنى وتختفي", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 1, explanation: "خطأ! مبدأ حفظ الطاقة ينص على أن الطاقة لا تُفنى ولا تُستحدث، بل تتحول من شكل إلى آخر", difficulty: "INTERMEDIATE" as const, type: "TRUE_FALSE" as const },

      // الإنجليزية - Tenses
      { lessonIdx: 11, question: "Which sentence is in the Present Perfect tense?", options: JSON.stringify(["I go to school every day", "I went to school yesterday", "I have gone to school already", "I will go to school tomorrow"]), correctAnswer: 2, explanation: "Present Perfect uses have/has + past participle. 'I have gone' is the correct form of Present Perfect tense", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 11, question: "\"I was studying when you called\" is in Past Continuous tense", options: JSON.stringify(["True", "False"]), correctAnswer: 0, explanation: "True! Past Continuous uses was/were + verb-ing. 'I was studying' is the correct Past Continuous form", difficulty: "BEGINNER" as const, type: "TRUE_FALSE" as const },

      // الإنجليزية - Vocabulary
      { lessonIdx: 12, question: "What is the Arabic meaning of \"library\"?", options: JSON.stringify(["مختبر", "مكتبة", "فصل", "ملعب"]), correctAnswer: 1, explanation: "Library means مكتبة in Arabic - a place where books are kept for reading and borrowing", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 12, question: "\"Homework\" means واجب منزلي in Arabic", options: JSON.stringify(["True", "False"]), correctAnswer: 0, explanation: "True! Homework means واجب منزلي - school work that students do at home", difficulty: "BEGINNER" as const, type: "TRUE_FALSE" as const },

      // الإنجليزية - Conversation
      { lessonIdx: 13, question: "How do you politely ask for help?", options: JSON.stringify(["Help me now!", "Could you help me, please?", "I need help", "Give me help"]), correctAnswer: 1, explanation: "'Could you help me, please?' is the most polite way to ask for help. Using 'could' and 'please' makes the request more courteous", difficulty: "INTERMEDIATE" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 13, question: "\"I agree\" means أوافق in Arabic", options: JSON.stringify(["True", "False"]), correctAnswer: 0, explanation: "True! 'I agree' means أوافق - it expresses that you share the same opinion", difficulty: "INTERMEDIATE" as const, type: "TRUE_FALSE" as const },

      // الكيمياء - الذرة
      { lessonIdx: 14, question: "ما الشحنة الكهربائية للبروتون؟", options: JSON.stringify(["موجبة", "سالبة", "متعادلة", "لا شحنة"]), correctAnswer: 0, explanation: "البروتونات هي جسيمات موجبة الشحنة توجد في نواة الذرة", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 14, question: "العدد الذري يساوي عدد النيوترونات في الذرة", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 1, explanation: "خطأ! العدد الذري يساوي عدد البروتونات وليس النيوترونات. العدد الكتلي = بروتونات + نيوترونات", difficulty: "BEGINNER" as const, type: "TRUE_FALSE" as const },

      // الكيمياء - الروابط
      { lessonIdx: 15, question: "أي نوع من الروابط يتكون من مشاركة الإلكترونات؟", options: JSON.stringify(["رابطة أيونية", "رابطة تساهمية", "رابطة فلزية", "رابطة هيدروجينية"]), correctAnswer: 1, explanation: "الرابطة التساهمية تتكون من مشاركة الإلكترونات بين ذرتين لا فلزيتين، مثل جزيء الماء H₂O", difficulty: "INTERMEDIATE" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 15, question: "ملح الطعام (NaCl) يحتوي على رابطة أيونية", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 0, explanation: "صحيح! كلوريد الصوديوم يحتوي على رابطة أيونية ناتجة عن انتقال إلكترون من الصوديوم (فلز) إلى الكلور (لا فلز)", difficulty: "INTERMEDIATE" as const, type: "TRUE_FALSE" as const },

      // التربية الإسلامية - أركان الإسلام
      { lessonIdx: 16, question: "ما هو الركن الأول من أركان الإسلام؟", options: JSON.stringify(["الصلاة", "الشهادتان", "الزكاة", "الصوم"]), correctAnswer: 1, explanation: "الشهادتان هما الركن الأول والأهم: شهادة أن لا إله إلا الله وأن محمداً رسول الله", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 16, question: "عدد الصلوات المفروضة خمس صلوات في اليوم والليلة", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 0, explanation: "صحيح! الصلوات الخمس المفروضة هي: الفجر والظهر والعصر والمغرب والعشاء", difficulty: "BEGINNER" as const, type: "TRUE_FALSE" as const },

      // التربية الإسلامية - أخلاق المسلم
      { lessonIdx: 17, question: "أي من التالي ليس من أخلاق المسلم؟", options: JSON.stringify(["الصدق", "الخيانة", "الأمانة", "التسامح"]), correctAnswer: 1, explanation: "الخيانة ليست من أخلاق المسلم، بل الإسلام يحرمها ويأمر بالأمانة والصدق والتسامح", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 17, question: "بر الوالدين يعني طاعتهما في كل شيء حتى لو أمرا بمعصية", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 1, explanation: "خطأ! بر الوالدين يعني طاعتهما في غير معصية الله. لا طاعة لمخلوق في معصية الخالق", difficulty: "BEGINNER" as const, type: "TRUE_FALSE" as const },

      // الاجتماعيات - جغرافية الوطن العربي
      { lessonIdx: 18, question: "كم قارة يربط بينها الوطن العربي؟", options: JSON.stringify(["قارتان", "ثلاث قارات", "أربع قارات", "قارة واحدة"]), correctAnswer: 1, explanation: "الوطن العربي يربط بين ثلاث قارات: آسيا وأفريقيا وأوروبا، مما أعطاه موقعاً استراتيجياً مهماً", difficulty: "BEGINNER" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 18, question: "نهر النيل يمر عبر عدة دول عربية", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 0, explanation: "صحيح! نهر النيل يمر عبر عدة دول منها مصر والسودان وغيرها، وهو أطول أنهار العالم", difficulty: "BEGINNER" as const, type: "TRUE_FALSE" as const },

      // الاجتماعيات - تاريخ الحضارة الإسلامية
      { lessonIdx: 19, question: "من مؤسس الدولة الإسلامية في المدينة المنورة؟", options: JSON.stringify(["أبو بكر الصديق", "النبي محمد ﷺ", "عمر بن الخطاب", "عثمان بن عفان"]), correctAnswer: 1, explanation: "النبي محمد صلى الله عليه وسلم هو مؤسس الدولة الإسلامية في المدينة المنورة بعد هجرته من مكة", difficulty: "INTERMEDIATE" as const, type: "MULTIPLE_CHOICE" as const },
      { lessonIdx: 19, question: "العلماء المسلمون لم يساهموا في تطوير الرياضيات", options: JSON.stringify(["صحيح", "خطأ"]), correctAnswer: 1, explanation: "خطأ! العلماء المسلمون أسهموا إسهاماً عظيماً في الرياضيات، ومحمد بن موسى الخوارزمي هو مؤسس علم الجبر", difficulty: "INTERMEDIATE" as const, type: "TRUE_FALSE" as const },
    ]

    const exercises = await Promise.all(
      exercisesData.map(e => db.exercise.create({
        data: {
          question: e.question,
          options: e.options,
          correctAnswer: e.correctAnswer,
          explanation: e.explanation,
          lessonId: lessons[e.lessonIdx].id,
          difficulty: e.difficulty,
          type: e.type,
        }
      }))
    )

    // ─── Seed Achievements ─────────────────────────────────
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

    const achievements = await Promise.all(
      achievementsData.map(a => db.achievement.create({ data: a }))
    )

    // ─── Seed Flashcards ───────────────────────────────────
    const flashcardsData = [
      { front: "ما ناتج (-3) × (-7)؟", back: "21 - حاصل ضرب عددين سالبين موجب", subject: "الرياضيات" },
      { front: "ما هي وحدة بناء الكائن الحي؟", back: "الخلية - هي أصغر وحدة بنائية ووظيفية في الكائن الحي", subject: "العلوم" },
      { front: "ما علامات الاسم؟", back: "التنوين، الألف واللام، حرف الجر، الإسناد إليه", subject: "اللغة العربية" },
      { front: "ما القانون الثاني لنيوتن؟", back: "القوة = الكتلة × التسارع (F = ma)", subject: "الفيزياء" },
      { front: "What is the Past Simple of 'go'?", back: "Went - The past simple of 'go' is 'went' (irregular verb)", subject: "الإنجليزية" },
      { front: "ما الفرق بين الرابطة الأيونية والتساهمية؟", back: "الأيونية: انتقال إلكترونات. التساهمية: مشاركة إلكترونات", subject: "الكيمياء" },
      { front: "ما أركان الإسلام الخمسة؟", back: "الشهادتان، الصلاة، الزكاة، الصوم، الحج", subject: "التربية الإسلامية" },
      { front: "ما أهمية موقع الوطن العربي؟", back: "يربط بين ثلاث قارات (آسيا وأفريقيا وأوروبا) ويتحكم في مضائق بحرية مهمة", subject: "الاجتماعيات" },
      { front: "ما هو الكسر المختلط؟", back: "عدد يتكون من عدد صحيح وكسر عادي، مثل: 2 و 1/3", subject: "الرياضيات" },
      { front: "ما هي وظيفة الميتوكندريا؟", back: "إنتاج الطاقة (ATP) من خلال عملية التنفس الخلوي", subject: "العلوم" },
    ]

    const flashcards = await Promise.all(
      flashcardsData.map(f => db.flashcard.create({
        data: {
          front: f.front,
          back: f.back,
          subject: f.subject,
          userId: null,
        }
      }))
    )

    return NextResponse.json({
      message: "تم إنشاء البيانات الأساسية بنجاح",
      counts: {
        subjects: subjects.length,
        lessons: lessons.length,
        exercises: exercises.length,
        achievements: achievements.length,
        flashcards: flashcards.length,
      }
    })
  } catch (error: any) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء البيانات", details: error.message }, { status: 500 })
  }
}
