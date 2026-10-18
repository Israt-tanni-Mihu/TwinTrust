/* Bangla -> English translation data and engine (used by site.js) */
(function () {
  'use strict';

  var D = {
    // ---- shared / nav / footer ----
    'টুইন ট্রাস্ট ল্যান্ড ভেরিফাই': 'Twin Trust Land Verify',
    'জমি যাচাই': 'Land Verification',
    'জমি খুঁজুন': 'Find Land',
    '← জমি খুঁজুন': '← Find Land',
    'আরো জানুন': 'Learn More',
    'লগইন': 'Login',
    'নতুন অ্যাকাউন্ট': 'New Account',
    'অফিসার আবেদন': 'Officer Application',
    'নতুন অ্যাকাউন্ট খুলুন': 'Create an account',
    'ইউজার হিসেবে': 'As a User',
    'অফিসার হিসেবে': 'As an Officer',
    'লগআউট': 'Logout',
    'বায়না জমা দিন': 'Submit Bayna',
    'বন্ধক জমা দিন': 'Submit Mortgage',
    'মামলা জমা দিন': 'Submit Case',
    'অ্যাডমিন পেজ': 'Admin Page',
    'ইউজার': 'User', 'অফিসার': 'Officer', 'অ্যাডমিন': 'Admin',
    'মেনু': 'Menu', 'বন্ধ করুন': 'Close',
    '← লগইন পেজে ফিরুন': '← Back to login page',
    'লোড হচ্ছে...': 'Loading...',
    'এটা একটি পরীক্ষামূলক প্রজেক্ট, সরকারি রেকর্ড নয়।': 'This is an experimental project, not an official government record.',
    'আপনার জমির তথ্য যাচাই করুন, ঝুঁকি জানুন, নিরাপদে সিদ্ধান্ত নিন।': 'Check your land records, know the risks, and decide safely.',
    'দ্রুত লিংক': 'Quick Links',
    'গুরুত্বপূর্ণ নোট': 'Important Notice',
    'এই সাইটে শুধু অ্যাডমিনের যাচাই করা তথ্য দেখানো হয়। জমি কেনার আগে উপজেলা ভূমি অফিসে গিয়ে নিজে যাচাই করে নিন।': 'This site only shows information verified by the admin. Before buying land, verify it yourself at the Upazila Land Office.',
    '© ২০২৬ টুইন ট্রাস্ট ল্যান্ড ভেরিফাই। সর্বস্বত্ব সংরক্ষিত।': '© 2026 Twin Trust Land Verify. All rights reserved.',

    // ---- home ----
    'জমি ঠিকমতো চেনার জন্য নিচের চারটা তথ্যই দিতে হবে।': 'To identify the land correctly, all four details below are required.',
    '১. মৌজা': '1. Mouza',
    '২. জরিপের ধরন': '2. Survey type',
    '৩. দাগ নম্বর': '3. Dag number',
    '৪. খতিয়ান নম্বর': '4. Khatian number',
    '৩. দাগ নম্বর (যেমন D-101)': '3. Dag number (e.g. D-101)',
    '৪. খতিয়ান নম্বর (যেমন K-201)': '4. Khatian number (e.g. K-201)',
    'জরিপ বেছে নিন': 'Select survey',
    'CS (ক্যাডাস্ট্রাল জরিপ)': 'CS (Cadastral Survey)',
    'SA (রাষ্ট্রীয় অধিগ্রহণ ও প্রজাস্বত্ব জরিপ)': 'SA (State Acquisition and Tenancy Survey)',
    'RS (সংশোধনী জরিপ)': 'RS (Revisional Survey)',
    'BS (বাংলাদেশ জরিপ)': 'BS (Bangladesh Survey)',
    'দাগ নম্বর লিখুন': 'Enter dag number',
    'খতিয়ান নম্বর লিখুন': 'Enter khatian number',
    'খুঁজুন': 'Search',
    'মৌজা বেছে নিন': 'Select mouza',
    'মৌজার তালিকা আনা যায়নি': 'Could not load the mouza list',
    'আপনি লগইন করেননি': 'You are not logged in',
    'খাস জমি': 'Khas land',
    'সরকারি অধিগ্রহণ': 'Government acquisition',
    'মামলা': 'Case',
    'বায়না (অগ্রিম টাকা)': 'Bayna (advance payment)',
    'বায়না': 'Bayna',
    'বন্ধক': 'Mortgage',
    'কৃষি জমি': 'Agricultural land', 'বসতভিটা': 'Homestead', 'পুকুর': 'Pond',
    'বাগান': 'Orchard', 'পতিত জমি': 'Fallow land', 'বাণিজ্যিক জমি': 'Commercial land',
    'শতাংশ': 'Decimal', 'কাঠা': 'Katha', 'বিঘা': 'Bigha', 'একর': 'Acre',
    'চলমান': 'Ongoing', 'নিষ্পত্তি': 'Settled',
    'জমি সংক্রান্ত বিরোধ': 'Land dispute', 'ফৌজদারি': 'Criminal', 'দেওয়ানি': 'Civil',
    'জালিয়াতি': 'Fraud', 'অন্যান্য': 'Other',
    'সরকারি খাস জমির রেকর্ড পাওয়া গেছে': 'Government khas land record found',
    'জমি অধিগ্রহণের নোটিশ জারি হয়েছে': 'Land acquisition notice issued',
    'এই জমির উপর আদালতে মামলা বিচারাধীন': 'A court case is pending on this land',
    'মালিককে বায়না (অগ্রিম টাকা) দেওয়া হয়েছে': 'Advance payment (bayna) has been given to the owner',
    'জমি ব্যাংক বা ঋণদাতার কাছে বন্ধক আছে': 'Land is mortgaged to a bank or lender',
    'মৌজা, জরিপের ধরন, দাগ নম্বর আর খতিয়ান নম্বর, চারটাই দিতে হবে।': 'Mouza, survey type, dag number and khatian number are all required.',
    'এই তথ্য দিয়ে কোনো জমি পাওয়া যায়নি। মৌজা, জরিপ, দাগ ও খতিয়ান নম্বর আবার মিলিয়ে দেখুন।': 'No land was found with these details. Please check the mouza, survey, dag and khatian numbers again.',
    'বিভাগ': 'Division', 'জেলা': 'District', 'উপজেলা': 'Upazila', 'মৌজা': 'Mouza',
    'জরিপের ধরন': 'Survey type', 'দাগ নম্বর': 'Dag number', 'খতিয়ান নম্বর': 'Khatian number',
    'মালিক': 'Owner', 'জমির পরিমাণ': 'Land area', 'জমির ধরন': 'Land type',
    'নম্বর': 'Number', 'অবস্থা': 'Status', 'মেয়াদ': 'Valid until',
    'মামলার ধরন': 'Case type', 'আদালত/থানা': 'Court/Police station',
    'এই জমিতে কোনো মামলা, বন্ধক, বায়না বা অধিগ্রহণের রেকর্ড নেই।': 'This land has no case, mortgage, bayna or acquisition records.',

    // ---- login ----
    'ইমেইল': 'Email', 'পাসওয়ার্ড': 'Password', 'নাম': 'Name',
    'লগইন করুন': 'Log in',
    'পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)': 'Password (at least 8 characters)',
    'অ্যাকাউন্ট খুলুন': 'Create account',
    'পুলিশের তালিকার সাথে তথ্য আর আপনার গোপন নিবন্ধন কোড মিললে আবেদন জমা হবে। অ্যাডমিন যাচাই করে অনুমোদন দিলে লগইন করা যাবে।': 'Your application will be submitted if your details and secret registration code match the police list. You can log in once the admin verifies and approves it.',
    'নাম (সরকারি রেকর্ড অনুযায়ী)': 'Name (as in official records)',
    'ব্যাচ নম্বর': 'Badge number',
    'অফিসার আইডি নম্বর': 'Officer ID number',
    'নিবন্ধন কোড (বিভাগ থেকে পাওয়া গোপন কোড)': 'Registration code (secret code from your department)',
    'আবেদন জমা দিন': 'Submit application',
    'জমি খোঁজার পেজে যান': 'Go to the Find Land page',
    'অ্যাডমিন পেজে যান': 'Go to the Admin page',
    'পাসওয়ার্ড দেখুন': 'Show password', 'পাসওয়ার্ড লুকান': 'Hide password',
    'আপনার অ্যাকাউন্ট এখনো চালু হয়নি। অ্যাডমিনের অনুমোদনের অপেক্ষা করুন।': 'Your account is not active yet. Please wait for admin approval.',
    'ইমেইল বা পাসওয়ার্ড ঠিক নেই।': 'Email or password is incorrect.',
    'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে।': 'An account has already been created with this email.',
    'আপনার দেওয়া তথ্য বা নিবন্ধন কোড মেলেনি।': 'Your details or registration code did not match.',
    'নিবন্ধন কোড দিন।': 'Enter the registration code.',
    'অনেকবার চেষ্টা করেছেন। ১৫ মিনিট পর আবার চেষ্টা করুন।': 'Too many attempts. Please try again after 15 minutes.',
    'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।': 'Password must be at least 8 characters.',
    'ইমেইল আর পাসওয়ার্ড দিন।': 'Enter your email and password.',
    'সব ঘর পূরণ করুন।': 'Please fill in all fields.',
    'সার্ভারের সাথে যোগাযোগ করা যায়নি।': 'Could not connect to the server.',
    'অ্যাকাউন্ট খোলা হয়েছে। এখন লগইন করুন।': 'Account created. Please log in now.',
    'আবেদন জমা হয়েছে। অ্যাডমিন অনুমোদন দিলে লগইন করতে পারবেন।': 'Application submitted. You can log in once the admin approves it.',

    // ---- learn ----
    'খাস জমি কাকে বলে?': 'What is khas land?',
    'খাস জমি হলো সরকারের মালিকানাধীন জমি। কোনো ব্যক্তি এই জমি নিজের নামে বিক্রি বা বন্ধক দিতে পারেন না। সরকার অনেক সময় নিয়ম মেনে এই জমি ভূমিহীন বা প্রয়োজনের ভিত্তিতে কাউকে বন্দোবস্ত দেয়।': 'Khas land is land owned by the government. No individual can sell or mortgage it in their own name. The government sometimes allots this land to landless people or others in need, following the rules.',
    'খাস জমি কেনা বা বায়না দেওয়া ঝুঁকিপূর্ণ। এই সাইটে খাস জমিতে বায়না বা বন্ধক জমা নেওয়া হয় না।': 'Buying khas land or paying bayna for it is risky. This site does not accept bayna or mortgage submissions for khas land.',
    'অধিগ্রহণ জমি বলতে কী বোঝায়?': 'What does acquired land mean?',
    'সরকার যখন জনস্বার্থে কোনো প্রকল্প বা প্রতিষ্ঠানের জন্য (যেমন সড়ক, সেতু, স্কুল বা হাসপাতাল) আইন মেনে কোনো জমি নিয়ে নেয় বা নেওয়ার প্রক্রিয়ায় থাকে, তখন সেই জমিকে অধিগ্রহণের আওতাধীন জমি বলা হয়। সাধারণত মালিক ক্ষতিপূরণ পান।': 'When the government takes, or is in the process of taking, land in the public interest for a project or institution (such as a road, bridge, school or hospital) in accordance with the law, that land is called land under acquisition. The owner usually receives compensation.',
    'অধিগ্রহণের আওতায় থাকা জমি কেনাবেচা বা বন্ধক রাখা ঝুঁকিপূর্ণ। এই সাইটে অধিগ্রহণের জমিতে বায়না বা বন্ধক জমা নেওয়া হয় না।': 'Buying, selling or mortgaging land under acquisition is risky. This site does not accept bayna or mortgage submissions for acquired land.',
    'রেকর্ডে কিছু না থাকলে কি জমি নিরাপদ?': 'If there is nothing in the record, is the land safe?',
    'না, নিশ্চিত করে বলা যায় না। এই সাইটে শুধু অ্যাডমিনের যাচাই করা তথ্য দেখানো হয়। কোনো তথ্য এখানে না থাকা মানে এই নয় যে আসলেই কিছু নেই। জমি কেনার আগে উপজেলা ভূমি অফিসে যোগাযোগ করে নিজে যাচাই করে নিন।': 'No, this cannot be guaranteed. This site only shows information verified by the admin. Not finding something here does not mean it does not exist. Before buying land, contact the Upazila Land Office and verify it yourself.',

    // ---- bayna / mortgage / officer shared ----
    'বায়না জমা': 'Submit Bayna', 'বন্ধক জমা': 'Submit Mortgage', 'মামলা জমা': 'Submit Case',
    'জমির চারটা তথ্য ঠিকমতো দিন। জমা দেওয়ার পর অ্যাডমিন যাচাই করবেন। অনুমোদন না হওয়া পর্যন্ত তথ্যটা সবার কাছে দেখাবে না। টাকার পরিমাণ শুধু অ্যাডমিন দেখতে পাবেন।': 'Enter the four land details correctly. The admin will verify after you submit. The information will not be visible to everyone until approved. Only the admin can see the amount.',
    'যার কাছে জমি বন্ধক রাখা হয়েছে (বন্ধকগ্রহীতা), তিনি এই ফর্ম পূরণ করবেন। জমির চারটা তথ্য ঠিকমতো দিন। জমা দেওয়ার পর অ্যাডমিন যাচাই করবেন। অনুমোদন না হওয়া পর্যন্ত তথ্যটা সবার কাছে দেখাবে না। টাকার পরিমাণ আর ঋণগ্রহীতার নাম শুধু অ্যাডমিন দেখতে পাবেন।': 'The person to whom the land is mortgaged (the mortgagee) should fill in this form. Enter the four land details correctly. The admin will verify after you submit. The information will not be visible to everyone until approved. Only the admin can see the amount and the borrower’s name.',
    'জমির চারটা তথ্য ঠিকমতো দিন। জমা দেওয়ার পর অ্যাডমিন যাচাই করবেন। অনুমোদন না হওয়া পর্যন্ত তথ্যটা সবার কাছে দেখাবে না।': 'Enter the four land details correctly. The admin will verify after you submit. The information will not be visible to everyone until approved.',
    'যেমন D-101': 'e.g. D-101', '৩. দাগ নম্বর ': '3. Dag number',
    'বায়নানামার নম্বর': 'Bayna agreement number',
    'বিক্রেতার নাম': 'Seller name',
    'বায়নার টাকার পরিমাণ (টাকা)': 'Bayna amount (BDT)',
    'বায়নার তারিখ': 'Bayna date',
    'বায়নার মেয়াদ (কত তারিখ পর্যন্ত)': 'Bayna validity (until which date)',
    'অতিরিক্ত তথ্য (না দিলেও চলবে)': 'Additional information (optional)',
    'জমা দিন': 'Submit',
    'আমার জমা দেওয়া বায়না': 'My submitted bayna',
    'আমার জমা দেওয়া বন্ধক': 'My submitted mortgages',
    'আমার জমা দেওয়া মামলা': 'My submitted cases',
    'বন্ধকের দলিল নম্বর': 'Mortgage deed number',
    'ঋণগ্রহীতার নাম (জমির মালিক)': 'Borrower name (land owner)',
    'ঋণের টাকার পরিমাণ (টাকা)': 'Loan amount (BDT)',
    'বন্ধকের তারিখ': 'Mortgage date',
    'বন্ধকের মেয়াদ (কত তারিখ পর্যন্ত)': 'Mortgage validity (until which date)',
    'যাচাইয়ের অপেক্ষায়': 'Awaiting verification', 'অনুমোদিত': 'Approved', 'বাতিল': 'Rejected',
    'এই চারটা তথ্য দিয়ে কোনো জমি পাওয়া যায়নি। মৌজা, জরিপ, দাগ ও খতিয়ান নম্বর মিলিয়ে দেখুন।': 'No land was found with these four details. Please check the mouza, survey, dag and khatian numbers.',
    'এই জমিতে বায়না দেওয়া যায় না, কারণ এটা সরকারি খাস জমি বা অধিগ্রহণের আওতায় আছে।': 'Bayna cannot be given on this land because it is government khas land or under acquisition.',
    'এই জমিতে এই বায়নানামার নম্বর আগেই জমা দেওয়া হয়েছে।': 'This bayna agreement number has already been submitted for this land.',
    'বায়নানামার নম্বর দিন।': 'Enter the bayna agreement number.',
    'বিক্রেতার নাম দিন।': 'Enter the seller name.',
    'টাকার পরিমাণ একটা পূর্ণ সংখ্যা হতে হবে, শূন্যের বেশি।': 'The amount must be a whole number greater than zero.',
    'বায়নার তারিখ ঠিক নেই (ভবিষ্যতের তারিখ হবে না)।': 'The bayna date is not valid (it cannot be a future date).',
    'মেয়াদের তারিখ ঠিক নেই (বায়নার তারিখের আগে হবে না)।': 'The validity date is not valid (it cannot be before the bayna date).',
    'অতিরিক্ত তথ্য ৫০০ অক্ষরের বেশি হবে না।': 'Additional information cannot exceed 500 characters.',
    'জমির চারটা তথ্যই দিতে হবে।': 'All four land details are required.',
    'লগইনের মেয়াদ শেষ। আবার লগইন করুন।': 'Your login has expired. Please log in again.',
    'এই কাজের অনুমতি শুধু ইউজারদের আছে।': 'Only users are allowed to do this.',
    'এই জমি বন্ধক রাখা যায় না, কারণ এটা সরকারি খাস জমি বা অধিগ্রহণের আওতায় আছে।': 'This land cannot be mortgaged because it is government khas land or under acquisition.',
    'এই জমিতে এই দলিল নম্বর আগেই জমা দেওয়া হয়েছে।': 'This deed number has already been submitted for this land.',
    'বন্ধকের দলিল নম্বর দিন।': 'Enter the mortgage deed number.',
    'ঋণগ্রহীতার নাম দিন।': 'Enter the borrower name.',
    'বন্ধকের তারিখ ঠিক নেই (ভবিষ্যতের তারিখ হবে না)।': 'The mortgage date is not valid (it cannot be a future date).',
    'মেয়াদের তারিখ ঠিক নেই (বন্ধকের তারিখের আগে হবে না)।': 'The validity date is not valid (it cannot be before the mortgage date).',
    'তালিকা আনা যায়নি।': 'Could not load the list.',
    'এখনো কোনো বায়না জমা দেননি।': 'You have not submitted any bayna yet.',
    'এখনো কোনো বন্ধক জমা দেননি।': 'You have not submitted any mortgage yet.',
    'এখনো কোনো মামলা জমা দেননি।': 'You have not submitted any case yet.',
    'দলিল নম্বর': 'Deed number',
    'জমি': 'Land', 'তারিখ': 'Date',
    'জমির চারটা তথ্যই দিন।': 'Enter all four land details.',
    'বায়নার সব ঘর পূরণ করুন (অতিরিক্ত তথ্য বাদে)।': 'Fill in all bayna fields (except additional information).',
    'বন্ধকের সব ঘর পূরণ করুন (অতিরিক্ত তথ্য বাদে)।': 'Fill in all mortgage fields (except additional information).',
    'বায়না জমা হয়েছে। অ্যাডমিন যাচাই করার পর এটা জমির তথ্যে দেখা যাবে।': 'Bayna submitted. It will appear in the land details after the admin verifies it.',
    'বন্ধক জমা হয়েছে। অ্যাডমিন যাচাই করার পর এটা জমির তথ্যে দেখা যাবে।': 'Mortgage submitted. It will appear in the land details after the admin verifies it.',
    'এই পেজ দেখতে ইউজার হিসেবে লগইন করতে হবে।': 'You must log in as a user to view this page.',
    'এই পেজ দেখতে অফিসার হিসেবে লগইন করতে হবে।': 'You must log in as an officer to view this page.',
    'এই পেজ দেখতে অ্যাডমিন হিসেবে লগইন করতে হবে।': 'You must log in as an admin to view this page.',

    // ---- officer ----
    'ধরন বেছে নিন': 'Select type',
    'মামলার নম্বর': 'Case number',
    'আদালত বা থানার নাম': 'Court or police station name',
    'আদালত বা থানা বেছে নিন': 'Select court or police station',
    'থানা': 'Police station', 'আদালত': 'Court',
    'সাভার মডেল থানা': 'Savar Model Police Station',
    'আশুলিয়া থানা': 'Ashulia Police Station',
    'ধামরাই থানা': 'Dhamrai Police Station',
    'গাজীপুর সদর থানা': 'Gazipur Sadar Police Station',
    'টঙ্গী থানা': 'Tongi Police Station',
    'কালিয়াকৈর থানা': 'Kaliakair Police Station',
    'সোনারগাঁও থানা': 'Sonargaon Police Station',
    'নারায়ণগঞ্জ সদর থানা': 'Narayanganj Sadar Police Station',
    'মির্জাপুর থানা': 'Mirzapur Police Station',
    'টাঙ্গাইল সদর থানা': 'Tangail Sadar Police Station',
    'সিংগাইর থানা': 'Singair Police Station',
    'মানিকগঞ্জ সদর থানা': 'Manikganj Sadar Police Station',
    'পলাশ থানা': 'Palash Police Station',
    'নরসিংদী সদর থানা': 'Narsingdi Sadar Police Station',
    'ঢাকা জেলা ও দায়রা জজ আদালত': 'Dhaka District and Sessions Judge Court',
    'গাজীপুর জেলা ও দায়রা জজ আদালত': 'Gazipur District and Sessions Judge Court',
    'নারায়ণগঞ্জ জেলা ও দায়রা জজ আদালত': 'Narayanganj District and Sessions Judge Court',
    'টাঙ্গাইল জেলা ও দায়রা জজ আদালত': 'Tangail District and Sessions Judge Court',
    'মানিকগঞ্জ জেলা ও দায়রা জজ আদালত': 'Manikganj District and Sessions Judge Court',
    'নরসিংদী জেলা ও দায়রা জজ আদালত': 'Narsingdi District and Sessions Judge Court',
    'মামলার তারিখ': 'Case date',
    'বিবরণ (১০ থেকে ১৫০০ অক্ষর)': 'Description (10 to 1500 characters)',
    'মামলা নিষ্পত্তির আবেদন': 'Case Closure Request',
    'আপনার নিজের জমা দেওয়া চলমান মামলা:': 'Ongoing cases you submitted yourself:',
    'অন্য অফিসারের জমা দেওয়া মামলা নিষ্পত্তি করতে চাইলে (যেমন বদলি বা ছুটির কারণে):': 'If you want to close a case submitted by another officer (for example due to a transfer or leave):',
    'অন্য মামলার নিষ্পত্তির আবেদন': 'Closure request for another case',
    'নিষ্পত্তির আবেদন ফর্ম': 'Closure Request Form',
    'মামলার নম্বর (যে মামলা নিষ্পত্তি হয়েছে)': 'Case number (the case that was settled)',
    'নিষ্পত্তির ধরন': 'Closure type',
    'রায় হয়েছে': 'Judgment delivered', 'মামলা খারিজ': 'Case dismissed', 'আপস হয়েছে': 'Settled by compromise',
    'প্রত্যাহার': 'Withdrawn', 'অন্য': 'Other',
    'নিষ্পত্তির তারিখ': 'Closure date',
    'আদেশ বা রায়ের নম্বর': 'Order or judgment number',
    'বিবরণ (না দিলেও চলবে)': 'Description (optional)',
    'আমার নিষ্পত্তির আবেদন': 'My closure requests',
    'নিষ্পত্তির আবেদন': 'Closure request',
    'এই জমিতে এই মামলার নম্বর আগেই জমা দেওয়া হয়েছে।': 'This case number has already been submitted for this land.',
    'মামলার ধরন বেছে নিন।': 'Select the case type.',
    'মামলার নম্বর দিন।': 'Enter the case number.',
    'আদালত বা থানার নাম দিন।': 'Enter the court or police station name.',
    'বিবরণ ১০ থেকে ১৫০০ অক্ষরের মধ্যে হতে হবে।': 'The description must be between 10 and 1500 characters.',
    'মামলার তারিখ ঠিক নেই (ভবিষ্যতের তারিখ হবে না)।': 'The case date is not valid (it cannot be a future date).',
    'নিষ্পত্তির ধরন বেছে নিন।': 'Select the closure type.',
    'আদেশ বা রায়ের নম্বর দিন।': 'Enter the order or judgment number.',
    'নিষ্পত্তির তারিখ ঠিক নেই (ভবিষ্যতের তারিখ হবে না)।': 'The closure date is not valid (it cannot be a future date).',
    'নিষ্পত্তির তারিখ মামলার তারিখের আগে হতে পারে না।': 'The closure date cannot be before the case date.',
    'এই জমিতে এই নম্বরের কোনো চলমান মামলা পাওয়া যায়নি। জমির তথ্য ও মামলার নম্বর মিলিয়ে দেখুন।': 'No ongoing case with this number was found on this land. Please check the land details and case number.',
    'এই মামলার নিষ্পত্তির আবেদন আগেই জমা আছে, অ্যাডমিনের সিদ্ধান্তের অপেক্ষায়।': 'A closure request for this case has already been submitted and is waiting for the admin’s decision.',
    'এই কাজের অনুমতি শুধু অফিসারদের আছে।': 'Only officers are allowed to do this.',
    'মামলার সব ঘর পূরণ করুন।': 'Fill in all case fields.',
    'মামলা জমা হয়েছে। অ্যাডমিন যাচাই করার পর এটা জমির তথ্যে দেখা যাবে।': 'Case submitted. It will appear in the land details after the admin verifies it.',
    'অন্য অফিসারের জমা দেওয়া মামলা। জমির তথ্য ও মামলার নম্বর দিন।': 'A case submitted by another officer. Enter the land details and case number.',
    'নিষ্পত্তির আবেদন করার মতো কোনো চলমান মামলা নেই।': 'There are no ongoing cases to request closure for.',
    'এখনো কোনো নিষ্পত্তির আবেদন করেননি।': 'You have not made any closure request yet.',
    'জমির চারটা তথ্য আর মামলার নম্বর দিন।': 'Enter the four land details and the case number.',
    'নিষ্পত্তির ধরন, তারিখ ও আদেশের নম্বর দিন।': 'Enter the closure type, date and order number.',
    'নিষ্পত্তির আবেদন জমা হয়েছে। অ্যাডমিন যাচাই করবেন। অনুমোদনের আগে মামলা চলমান থাকবে।': 'Closure request submitted. The admin will verify it. The case remains ongoing until approved.',

    // ---- admin ----
    'অপেক্ষমাণ মামলা (যাচাই করুন)': 'Pending cases (review)',
    'অপেক্ষমাণ বায়না (যাচাই করুন)': 'Pending bayna (review)',
    'অপেক্ষমাণ বন্ধক (যাচাই করুন)': 'Pending mortgages (review)',
    'অপেক্ষমাণ নিষ্পত্তির আবেদন (যাচাই করুন)': 'Pending closure requests (review)',
    'অপেক্ষমাণ অফিসার আবেদন': 'Pending officer applications',
    'এই মামলার নম্বর অন্য একটা জমিতেও দেওয়া আছে। সতর্কভাবে মিলিয়ে দেখুন।': 'This case number is also given on another land. Please check carefully.',
    'অফিসারের থানার জেলা আর জমির জেলা আলাদা। সতর্কভাবে মিলিয়ে দেখুন।': 'The officer’s police station district differs from the land’s district. Please check carefully.',
    'এই জমি সরকারি খাস জমি হিসেবে রেকর্ডে আছে। ব্যক্তিগত বিরোধের মামলা এখানে সন্দেহজনক। শুধু খাস জমি দখল বা জালিয়াতির মামলা হলে অনুমোদন করুন।': 'This land is recorded as government khas land. A private dispute case here is suspicious. Approve only if it is a khas land occupation or fraud case.',
    'জমা দেওয়া নাম রেকর্ডে থাকা মালিকের নামের সাথে মেলে না। ওয়ারিশ বা আমমোক্তার কিনা যাচাই করুন।': 'The submitted name does not match the owner’s name in the record. Check whether the person is an heir or attorney.',
    'এই জমি সরকারি অধিগ্রহণের আওতায় আছে।': 'This land is under government acquisition.',
    'এই জমিতে আগে থেকেই আরেকটা চলমান বায়না বা বন্ধক অনুমোদিত আছে।': 'Another ongoing bayna or mortgage is already approved on this land.',
    'এই জমিতে একটা চলমান মামলা অনুমোদিত আছে।': 'An ongoing case is already approved on this land.',
    'মেয়াদের তারিখ আজকের আগে, অর্থাৎ মেয়াদ শেষ।': 'The validity date is before today, so it has expired.',
    'অনুমোদন দিন': 'Approve', 'বাতিল করুন': 'Reject',
    'এই জমির অন্যান্য রেকর্ড': 'Other records on this land',
    'এই জমিতে আর কোনো রেকর্ড নেই।': 'There are no other records on this land.',
    'ডাটাবেজে থাকা জমির তথ্য': 'Land details in the database',
    'উপজেলা / জেলা': 'Upazila / District',
    'জরিপ / দাগ': 'Survey / Dag',
    'খতিয়ান': 'Khatian',
    'অফিসারের জমা দেওয়া তথ্য': 'Information submitted by the officer',
    'অফিসার': 'Officer',
    'এখন কোনো অপেক্ষমাণ মামলা নেই।': 'There are no pending cases right now.',
    'এখন কোনো অপেক্ষমাণ বায়না নেই।': 'There are no pending bayna right now.',
    'এখন কোনো অপেক্ষমাণ বন্ধক নেই।': 'There are no pending mortgages right now.',
    'এখন কোনো অপেক্ষমাণ নিষ্পত্তির আবেদন নেই।': 'There are no pending closure requests right now.',
    'এখন কোনো অপেক্ষমাণ আবেদন নেই।': 'There are no pending applications right now.',
    'জমির তথ্য মিলিয়ে দেখেছেন? এই মামলা অনুমোদন করলে এটা সবার জন্য জমির তথ্যে দেখাবে।': 'Have you checked the land details? If you approve this case, it will be shown to everyone in the land details.',
    'এই মামলা বাতিল করবেন?': 'Reject this case?',
    'মামলা অনুমোদন করা হয়েছে।': 'Case approved.',
    'মামলা বাতিল করা হয়েছে।': 'Case rejected.',
    'ইউজারের জমা দেওয়া তথ্য': 'Information submitted by the user',
    'বন্ধকের দলিল নম্বর ': 'Mortgage deed number',
    'টাকার পরিমাণ': 'Amount',
    'জমা দিয়েছেন': 'Submitted by',
    '✔ জমা দেওয়া নাম রেকর্ডে থাকা মালিকের নামের সাথে মিলেছে।': '✔ The submitted name matches the owner’s name in the record.',
    'আবেদনকারীর দেওয়া নিষ্পত্তির তথ্য': 'Closure information given by the applicant',
    'আবেদনকারী অফিসার': 'Applicant officer',
    'ডাটাবেজে থাকা মামলা ও জমির তথ্য': 'Case and land details in the database',
    'তথ্য মিলিয়ে দেখেছেন? অনুমোদন করলে মামলাটা "নিষ্পত্তি হয়েছে" হিসেবে সবার জন্য দেখাবে।': 'Have you checked the details? If you approve, the case will be shown to everyone as "settled".',
    'এই নিষ্পত্তির আবেদন বাতিল করবেন? মামলা আগের মতোই চলমান থাকবে।': 'Reject this closure request? The case will remain ongoing as before.',
    'নিষ্পত্তি অনুমোদন করা হয়েছে।': 'Closure approved.',
    'নিষ্পত্তির আবেদন বাতিল করা হয়েছে।': 'Closure request rejected.',
    'অজানা (পুরনো রেকর্ড)': 'Unknown (old record)',
    'আবেদনকারীর দেওয়া তথ্য': 'Information submitted by the applicant',
    'অফিসার আইডি': 'Officer ID',
    'আবেদনের সময়': 'Application time',
    'পুলিশ তালিকায় থাকা তথ্য': 'Information in the police list',
    'পদবি': 'Rank',
    'থানার ফোন (ডেমো)': 'Station phone (demo)',
    '✔ আবেদনকারীর নাম পুলিশ তালিকার নামের সাথে মিলেছে।': '✔ The applicant’s name matches the name in the police list.',
    '⚠ আবেদনকারীর নাম পুলিশ তালিকার নামের সাথে মেলে না।': '⚠ The applicant’s name does not match the name in the police list.',
    '✔ ব্যাচ নম্বর, অফিসার আইডি ও গোপন নিবন্ধন কোড পুলিশ তালিকার সাথে মিলেছে।': '✔ The badge number, officer ID and secret registration code match the police list.',
    'থানায়': 'the police station',
    'নম্বর নেই': 'no number'
  };

  var DIGITS = { '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4', '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9' };
  function latinDigits(s) { return s.replace(/[০-৯]/g, function (c) { return DIGITS[c]; }); }

  var FAIL = { 'সমস্যা হয়েছে': 'Problem', 'জমা হয়নি': 'Could not submit', 'অ্যাকাউন্ট হয়নি': 'Could not create account', 'আবেদন হয়নি': 'Could not submit application', 'লগইন হয়নি': 'Login failed', 'কাজ হয়নি': 'Action failed' };
  var WORD = { 'বায়না': 'Bayna', 'বন্ধক': 'Mortgage' };
  var WORD_L = { 'বায়না': 'bayna', 'বন্ধক': 'mortgage' };

  var P = [
    [/^স্বাগতম, (.+) \((ইউজার|অফিসার|অ্যাডমিন)\)$/, function (m, t) { return 'Welcome, ' + m[1] + ' (' + t(m[2]) + ')'; }],
    [/^(সমস্যা হয়েছে|জমা হয়নি|অ্যাকাউন্ট হয়নি|আবেদন হয়নি|লগইন হয়নি|কাজ হয়নি): (.*)$/, function (m, t) { return FAIL[m[1]] + ': ' + t(m[2]); }],
    [/^যেমন (.+)$/, function (m) { return 'e.g. ' + m[1]; }],
    [/^মামলা: (.+)$/, function (m, t) { return 'Case: ' + t(m[1]); }],
    [/^(✔|⚠) (.+)$/, function (m, t) { return m[1] + ' ' + t(m[2]); }],
    [/^এই অফিসার মোট (\d+)টা মামলা জমা দিয়েছেন: (\d+)টা অনুমোদিত, (\d+)টা বাতিল।$/, function (m) { return 'This officer has submitted ' + m[1] + ' case(s) in total: ' + m[2] + ' approved, ' + m[3] + ' rejected.'; }],
    [/^এই ইউজার মোট (\d+)টা বায়না বা বন্ধক জমা দিয়েছেন: (\d+)টা অনুমোদিত, (\d+)টা বাতিল।$/, function (m) { return 'This user has submitted ' + m[1] + ' bayna/mortgage record(s) in total: ' + m[2] + ' approved, ' + m[3] + ' rejected.'; }],
    [/^(বায়না|বন্ধক) অনুমোদন করা হয়েছে।$/, function (m) { return WORD[m[1]] + ' approved.'; }],
    [/^(বায়না|বন্ধক) বাতিল করা হয়েছে।$/, function (m) { return WORD[m[1]] + ' rejected.'; }],
    [/^জমির তথ্য মিলিয়ে দেখেছেন\? এই (বায়না|বন্ধক) অনুমোদন করলে মেয়াদসহ সবার জন্য জমির তথ্যে দেখাবে \(টাকার পরিমাণ ও নাম দেখাবে না\)।$/, function (m) { return 'Have you checked the land details? If you approve this ' + WORD_L[m[1]] + ', it will be shown to everyone in the land details with its validity (the amount and names will not be shown).'; }],
    [/^এই (বায়না|বন্ধক) বাতিল করবেন\?$/, function (m) { return 'Reject this ' + WORD_L[m[1]] + '?'; }],
    [/^থানায় ফোন করে নিশ্চিত হয়েছেন\? (.+)-এর আবেদন অনুমোদন করবেন\?$/, function (m) { return 'Have you confirmed by calling the police station? Approve ' + m[1] + '’s application?'; }],
    [/^(.+)-এর আবেদন অনুমোদন করা হয়েছে।$/, function (m) { return m[1] + '’s application approved.'; }],
    [/^(.+)-এর আবেদন বাতিল করা হয়েছে।$/, function (m) { return m[1] + '’s application rejected.'; }],
    [/^(.+)-এর আবেদন বাতিল করবেন\?$/, function (m) { return 'Reject ' + m[1] + '’s application?'; }],
    [/^☎ অনুমোদনের আগে (.+) ফোন করে \((.+)\) নিশ্চিত হোন যে এই নামের অফিসার সত্যিই আবেদন করেছেন।$/, function (m, t) { return '☎ Before approving, call ' + t(m[1]) + ' (' + t(m[2]) + ') to confirm that an officer with this name really applied.'; }],
    [/^অনুমোদন দিলে ইনি (.+), (.+) থানার (.+) হিসেবে মামলা জমা ও নিষ্পত্তির আবেদন করতে পারবেন।$/, function (m, t) { return 'Once approved, this person can submit cases and closure requests as ' + t(m[3]) + ' of ' + m[1] + ', ' + m[2] + ' police station.'; }],
    [/^মামলাটা মূলত জমা দিয়েছিলেন: (.+)। নিষ্পত্তির আবেদন করেছেন: (.+)।$/, function (m, t) { return 'The case was originally submitted by: ' + t(m[1]) + '. Closure requested by: ' + t(m[2]) + '.'; }],
    [/^(.+) টাকা$/, function (m) { return m[1] + ' BDT'; }]
  ];

  function lookup(c) { return Object.prototype.hasOwnProperty.call(D, c) ? D[c] : null; }

  function core(c) {
    var r = lookup(c);
    if (r !== null) return r;
    var i, m;
    for (i = 0; i < P.length; i++) {
      m = c.match(P[i][0]);
      if (m) return P[i][1](m, tr);
    }
    // "a | b | c" -> translate each piece
    if (c.indexOf(' | ') > -1) {
      return c.split(' | ').map(function (s) { return tr(s); }).join(' | ');
    }
    // "label: value"
    var k = c.indexOf(': ');
    if (k > 0 && k < 60) {
      var a = c.slice(0, k), b = c.slice(k + 2);
      var ta = lookup(a), tb = tr(b);
      if (ta !== null || tb !== b) return (ta !== null ? ta : a) + ': ' + tb;
    }
    // "JL" in mouza names
    if (c.indexOf('জেএল') > -1) return c.replace(/জেএল/g, 'JL');
    return c;
  }

  function tr(s) {
    var lead = s.match(/^\s*/)[0];
    var trail = s.match(/\s*$/)[0];
    var c = s.trim().replace(/\s+/g, ' ');
    if (!c) return s;
    var r = core(c);
    if (r === c) {
      // pure numbers/dates written with Bangla digits
      if (/[০-৯]/.test(c) && /^[০-৯0-9,.\s:\/-]+$/.test(c)) r = latinDigits(c);
      else return s;
    } else if (/[০-৯]/.test(r)) {
      r = latinDigits(r);
    }
    return lead + r + trail;
  }

  window.TT_I18N = { tr: tr, dict: D };
})();
