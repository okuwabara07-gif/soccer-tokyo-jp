'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Sponsor = {
  id: string
  name: string
  image_url: string
  link_url: string
  position: string
  is_active: boolean
}

export default function SponsorBanner({ position }: { position: string }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])

  useEffect(() => {
    supabase.from('sponsors')
      .select('*')
      .eq('position', position)
      .eq('is_active', true)
      .then(({ data }) => setSponsors(data || []))
  }, [position])

  if (sponsors.length === 0) return null

  return (
    <div style={{padding:'0 16px',marginBottom:12}}>
      {sponsors.map(s => (
        <a key={s.id}
          href={s.link_url || 'mailto:info@aokae.co.jp'}
          target="_blank"
          rel="noopener noreferrer"
          style={{display:'block',borderRadius:10,overflow:'hidden',textDecoration:'none'}}>
          {s.image_url ? (
            <img src={s.image_url} alt={s.name}
              style={{width:'100%',height:80,objectFit:'cover',borderRadius:10}}/>
          ) : (
            <div style={{background:'#f0f0ec',border:'1.5px dashed #ccc',borderRadius:10,
              padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <p style={{fontSize:10,color:'#999',marginBottom:2,letterSpacing:'0.1em'}}>SPONSOR</p>
                <p style={{fontSize:12,fontWeight:500,color:'#666'}}>スポンサー募集中</p>
                <p style={{fontSize:10,color:'#aaa'}}>お問い合わせはこちら →</p>
              </div>
              <div style={{background:'#1a1a1a',borderRadius:8,padding:'6px 12px'}}>
                <p style={{fontSize:10,color:'white',fontWeight:500}}>掲載のご案内</p>
              </div>
            </div>
          )}
        </a>
      ))}
    </div>
  )
}
