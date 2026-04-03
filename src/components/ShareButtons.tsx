'use client'

type Props = {
  title: string
  text: string
  url?: string
}

export default function ShareButtons({ title, text, url = 'https://soccer-tokyo-jp.vercel.app' }: Props) {
  const encodedText = encodeURIComponent(text)
  const encodedUrl = encodeURIComponent(url)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${text} ${url}`)
    alert('コピーしました！')
  }

  const BUTTONS = [
    {
      label: 'X',
      color: '#0a0a0a',
      textColor: 'white',
      icon: '𝕏',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      label: 'LINE',
      color: '#06C755',
      textColor: 'white',
      icon: '💬',
      href: `https://line.me/R/msg/text/?${encodedText}%0A${encodedUrl}`,
    },
    {
      label: 'Facebook',
      color: '#1877F2',
      textColor: 'white',
      icon: 'f',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    },
    {
      label: 'Instagram',
      color: '#E1306C',
      textColor: 'white',
      icon: '📸',
      href: null,
      onClick: () => {
        navigator.clipboard.writeText(`${text} ${url}`)
        alert('テキストをコピーしました！Instagramのストーリーまたは投稿に貼り付けてください。')
      },
    },
  ]

  return (
    <div style={{marginTop:12}}>
      <p style={{fontSize:9,letterSpacing:'0.15em',color:'#999',marginBottom:8,textTransform:'uppercase'}}>シェアする</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:6,marginBottom:8}}>
        {BUTTONS.map(btn=>(
          btn.href ? (
            <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
              style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'10px 4px',
                borderRadius:10,background:btn.color,textDecoration:'none'}}>
              <span style={{fontSize:16,color:btn.textColor}}>{btn.icon}</span>
              <span style={{fontSize:9,color:btn.textColor,letterSpacing:'0.05em'}}>{btn.label}</span>
            </a>
          ) : (
            <button key={btn.label} onClick={btn.onClick}
              style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'10px 4px',
                borderRadius:10,background:btn.color,border:'none',cursor:'pointer'}}>
              <span style={{fontSize:16,color:btn.textColor}}>{btn.icon}</span>
              <span style={{fontSize:9,color:btn.textColor,letterSpacing:'0.05em'}}>{btn.label}</span>
            </button>
          )
        ))}
      </div>
      <button onClick={copyToClipboard}
        style={{width:'100%',padding:'10px',borderRadius:8,border:'1px solid #e8e8e4',
          background:'white',color:'#666',fontSize:11,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
        <span>🔗</span> リンクをコピー
      </button>
    </div>
  )
}
