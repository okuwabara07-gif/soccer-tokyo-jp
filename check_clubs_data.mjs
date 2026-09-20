import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://bhgvpikwhbphodswzfip.supabase.co',
  'sb_publishable_jI1EG0g1M-jEM1nx68ZCww_0eApZZ4V'
);

(async () => {
  // 1. Count published clubs
  const { count: total } = await supabase
    .from('clubs')
    .select('*', { count: 'exact', head: true })
    .eq('is_published', true);
  console.log('Published clubs:', total);

  // 2. Get sample club
  const { data: sample, error } = await supabase
    .from('clubs')
    .select('*')
    .eq('is_published', true)
    .limit(1);
  
  if (error) {
    console.error('Error:', error);
  } else if (sample && sample[0]) {
    console.log('\nSample club fields:');
    console.log(Object.keys(sample[0]).sort());
    console.log('\nSample values:');
    const c = sample[0];
    console.log('  slug:', c.slug);
    console.log('  name:', c.name);
    console.log('  prefecture:', c.prefecture);
    console.log('  club_type:', c.club_type);
    console.log('  strength_label:', c.strength_label);
    console.log('  category:', c.category);
  }

  // 3. Unique values
  const { data: clubs } = await supabase
    .from('clubs')
    .select('prefecture,club_type,strength_label,category')
    .eq('is_published', true);
  
  if (clubs) {
    const prefs = [...new Set(clubs.map(c => c.prefecture))].sort();
    const types = [...new Set(clubs.map(c => c.club_type))].sort();
    const strengths = [...new Set(clubs.map(c => c.strength_label))].sort();
    const categories = [...new Set(clubs.map(c => c.category))].sort();
    
    console.log('\nUnique prefectures:', prefs);
    console.log('Unique club_types:', types);
    console.log('Unique strength_labels:', strengths);
    console.log('Unique categories:', categories);
  }
})();
