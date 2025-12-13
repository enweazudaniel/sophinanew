import Image from "next/image"
import type { Metadata } from "next"
import { ClassImageSlider } from "@/components/class-image-slider"

export const metadata: Metadata = {
  title: "Our School",
  description:
    "Explore our school facilities, classes, and dedicated staff at Sophina Nursery and Primary School. From Pre-Nursery to Basic 8, we offer comprehensive education.",
  openGraph: {
    title: "Our School | Sophina Nursery and Primary School",
    description:
      "Discover our comprehensive educational programs from Pre-Nursery to Basic 8, and meet our dedicated staff.",
    images: [
      {
        url: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg",
        width: 1200,
        height: 630,
        alt: "Sophina School Facilities",
      },
    ],
  },
}
// Colour Day images
const colourdayImages = [
  "https://i.ibb.co/21gq53wx/PXL-20240326-094033787.jpg",
  "https://i.ibb.co/xKXn4CXj/PXL-20240326-103119393.jpg",
  "https://i.ibb.co/Kxjxkpgn/PXL-20240326-103729604.jpg",
  "https://i.ibb.co/tPJX2YjN/PXL-20240326-114354119.jpg",
  "https://i.ibb.co/HLppFDWW/PXL-20240326-115254862.jpg",
  "https://i.ibb.co/TBRD7WXr/PXL-20240326-115401864.jpg",
  "https://i.ibb.co/HLKYmqrr/PXL-20240326-115405424.jpg",
  "https://i.ibb.co/KzXMCrLx/PXL-20240326-115540013.jpg",
  "https://i.ibb.co/rRXT69MJ/PXL-20240326-115803212.jpg",
  "https://i.ibb.co/SDZYrBKn/PXL-20240326-120441325.jpg",
  "https://i.ibb.co/7NQZfhdP/PXL-20250404-101357895.jpg",
  "https://i.ibb.co/W4JsCRkp/PXL-20250404-101429748.jpg",
  "https://i.ibb.co/Z1XQjX32/PXL-20250404-101437933.jpg",
  "https://i.ibb.co/m5x8H8Fd/PXL-20250404-101455281.jpg",
  "https://i.ibb.co/fGtMV3bC/PXL-20250404-101819821.jpg",
  "https://i.ibb.co/fzBK86jR/PXL-20250404-102107766.jpg",
  "https://i.ibb.co/W4rp0Yy7/PXL-20250404-102725379.jpg",
  "https://i.ibb.co/d4vZRB00/PXL-20250404-103007073.jpg",
  "https://i.ibb.co/4gRC8B54/PXL-20250404-103022204.jpg",
  "https://i.ibb.co/tTXDD3jT/PXL-20250404-103630711.jpg",
  "https://i.ibb.co/PGhs7Mgt/PXL-20250404-103635859.jpg",
  "https://i.ibb.co/5WPzCY5r/PXL-20250404-103702306.jpg",
  "https://i.ibb.co/XryWVpgP/PXL-20250404-103917568.jpg",
  "https://i.ibb.co/PZ9j42C2/PXL-20250404-104038298.jpg",
  "https://i.ibb.co/ds7QnpM3/PXL-20250404-104503344.jpg",
  "https://i.ibb.co/5gYRJQvL/PXL-20250404-105348201.jpg",
  "https://i.ibb.co/TqqFJVJc/PXL-20250404-105357920.jpg",
  "https://i.ibb.co/gMHVZ9Lj/PXL-20250404-105403850.jpg",
  "https://i.ibb.co/mCWV4fC3/PXL-20250404-105525456.jpg",
  "https://i.ibb.co/7J7L4y1n/PXL-20250404-105701329.jpg",
  "https://i.ibb.co/Fkrbt5FH/PXL-20250404-105957796.jpg",
  "https://i.ibb.co/MyGqL3GH/PXL-20250404-110041514.jpg",
  "https://i.ibb.co/Fk970rXk/PXL-20250404-110325337.jpg",
  "https://i.ibb.co/p6gYhSMK/PXL-20250404-110418361.jpg",
  "https://i.ibb.co/xtxM3b1j/PXL-20250404-110456605.jpg",
  "https://i.ibb.co/JwMXTMCX/PXL-20250404-110529889.jpg",
  "https://i.ibb.co/jZ1YZ49m/PXL-20250404-110752313.jpg",
  "https://i.ibb.co/wFtGVQP0/PXL-20250404-110902442.jpg",
  "https://i.ibb.co/nqNqC5d3/PXL-20250404-121308568.jpg",
  "https://i.ibb.co/Mk8PB6Hr/PXL-20250404-122251219.jpg",
  "https://i.ibb.co/mCXBvVS3/PXL-20250404-124030498.jpg",
  "https://i.ibb.co/TxGYY9tt/PXL-20250404-132437931.jpg",
  "https://i.ibb.co/h1BZSLd3/PXL-20250404-105809865-Copy.jpg",
]

// Graduation images
const graduationImages = [
  //new 2025
  "https://i.ibb.co/qMTSRXDH/PXL-20250723-090053514.jpg",
  "https://i.ibb.co/pDJKJyJ/PXL-20250723-113643710.jpg",
  "https://i.ibb.co/DDc86x79/PXL-20250723-113754786.jpg",
  "https://i.ibb.co/gFjd4Mxw/PXL-20250723-113759456.jpg",
  "https://i.ibb.co/WNDd5y3v/PXL-20250723-113802564.jpg",
  "https://i.ibb.co/Y7Jv715q/PXL-20250723-113805870.jpg",
  "https://i.ibb.co/vx8kWyMS/PXL-20250723-113814810.jpg",
  "https://i.ibb.co/LXn7fbZJ/PXL-20250723-113821692.jpg",
  "https://i.ibb.co/2Y3jHF8h/PXL-20250723-114825014.jpg",
  "https://i.ibb.co/jPhcjyrH/PXL-20250723-114843250.jpg",
  "https://i.ibb.co/BkdyFh1/PXL-20250723-114901660.jpg",
  "https://i.ibb.co/tp1WH6K3/PXL-20250723-114908293.jpg",
  "https://i.ibb.co/8ghp7x2Y/PXL-20250723-114914841.jpg",
  "https://i.ibb.co/RG2dgwQq/PXL-20250723-114929277.jpg",
  "https://i.ibb.co/5X0BmDtm/PXL-20250723-114936126.jpg",
  "https://i.ibb.co/6cVwhGFQ/PXL-20250723-114948841.jpg",
  "https://i.ibb.co/TByZwjN5/PXL-20250723-115517559.jpg",
  "https://i.ibb.co/rRdGLNBg/PXL-20250723-120402066.jpg",
  "https://i.ibb.co/3506ZZSD/PXL-20250723-121340280.jpg",
  "https://i.ibb.co/4nMwZcN8/PXL-20250723-121443062.jpg",
  "https://i.ibb.co/dwjB6zk7/PXL-20250723-121701772.jpg",
  "https://i.ibb.co/Nd7k5FTT/PXL-20250723-121723337.jpg",
  "https://i.ibb.co/7t6NgwGJ/PXL-20250723-121747008.jpg",
  "https://i.ibb.co/3yyHjyhD/PXL-20250723-122029708.jpg",
  "https://i.ibb.co/tTJSMj6x/PXL-20250723-122050166.jpg",
  "https://i.ibb.co/cX71Xw9G/PXL-20250723-122428361.jpg",
  "https://i.ibb.co/fdz7tv88/PXL-20250723-124210499.jpg",
  "https://i.ibb.co/p6bYtPK5/PXL-20250723-124315405.jpg",
  "https://i.ibb.co/HL6BYmcj/PXL-20250723-124418764.jpg",
  "https://i.ibb.co/PZSC3JYG/PXL-20250723-124731806.jpg",
  "https://i.ibb.co/s9QZB432/PXL-20250723-125952386.jpg",
  "https://i.ibb.co/Vc5k9BVs/PXL-20250723-125957040.jpg",
  "https://i.ibb.co/MDVKhHZs/PXL-20250723-130006582.jpg",
  "https://i.ibb.co/JFgLZVQ7/PXL-20250723-130010037.jpg",
  "https://i.ibb.co/6hdmb1S/PXL-20250723-130013998.jpg",
  "https://i.ibb.co/dwb95Z25/PXL-20250723-130017457.jpg",
  "https://i.ibb.co/KSBPrDw/PXL-20250723-130235792.jpg",
  "https://i.ibb.co/FLWJ6msc/PXL-20250723-130336520.jpg",
  "https://i.ibb.co/Qv6rthwc/PXL-20250723-131026170.jpg",
  "https://i.ibb.co/mCG7CXXs/PXL-20250723-131054067.jpg",
  "https://i.ibb.co/9kW913nS/PXL-20250723-131219381.jpg",
  "https://i.ibb.co/3m6PGxqT/PXL-20250723-131225518.jpg",
  "https://i.ibb.co/GvfMRrvy/PXL-20250723-131246367.jpg",
  "https://i.ibb.co/LdJrbn9Q/PXL-20250723-131259632.jpg",
  "https://i.ibb.co/60sq67T0/PXL-20250723-131310861.jpg",
  "https://i.ibb.co/K4928x6/PXL-20250723-131329237.jpg",
  "https://i.ibb.co/359WZp8t/PXL-20250723-131337471.jpg",
  "https://i.ibb.co/d4ZGHtN7/PXL-20250723-131357354.jpg",
  "https://i.ibb.co/3Y0VZBDR/PXL-20250723-131406409.jpg",
  "https://i.ibb.co/ccWy6XDL/PXL-20250723-131430750.jpg",
  "https://i.ibb.co/MyJ6nkJf/PXL-20250723-131449305.jpg",
  "https://i.ibb.co/zWwxfHRK/PXL-20250723-131512368.jpg",
  "https://i.ibb.co/HLnt7rCZ/PXL-20250723-131523827.jpg",
  "https://i.ibb.co/PZB5WJhh/PXL-20250723-131534954.jpg",
  "https://i.ibb.co/YBfYqPtY/PXL-20250723-131549306.jpg",
  "https://i.ibb.co/pjQRf2D2/PXL-20250723-131557359.jpg",
  "https://i.ibb.co/gb961rd2/PXL-20250723-131622951.jpg",
  "https://i.ibb.co/whNqLx62/PXL-20250723-131642499.jpg",
  "https://i.ibb.co/BVHtM2Jb/PXL-20250723-131703484.jpg",
  "https://i.ibb.co/8D8Vx4yc/PXL-20250723-131759794.jpg",
  "https://i.ibb.co/1tNPcjQz/PXL-20250723-131835199.jpg",
  "https://i.ibb.co/jvtyBKyk/PXL-20250723-131936643.jpg",
  "https://i.ibb.co/67n90MYY/PXL-20250723-132207568.jpg",
  "https://i.ibb.co/0pCmC6Ks/PXL-20250723-132308053.jpg",
  "https://i.ibb.co/fVCCVzcS/PXL-20250723-132432734.jpg",
  "https://i.ibb.co/k6qDs0jZ/PXL-20250723-132436367.jpg",
  "https://i.ibb.co/qLD4Sfj8/PXL-20250723-132526365.jpg",
  "https://i.ibb.co/HfrWCyqG/PXL-20250723-134815660.jpg",
  "https://i.ibb.co/SDD5TnSV/PXL-20250723-134901834.jpg",
  "https://i.ibb.co/CsYXMTf4/PXL-20250723-135137400.jpg",
  "https://i.ibb.co/6JTWq5ct/PXL-20250723-135839141.jpg",
  "https://i.ibb.co/0j8rzvD4/PXL-20250723-140041417.jpg",
  "https://i.ibb.co/jFpnY2Q/PXL-20250723-140100190.jpg",
  "https://i.ibb.co/TZqnZng/PXL-20250723-140227819.jpg",
  "https://i.ibb.co/kgNrks5R/PXL-20250723-140438023.jpg",
  "https://i.ibb.co/23BWcgnn/PXL-20250723-140627535.jpg",
  "https://i.ibb.co/yFvKSYgY/PXL-20250723-140802710.jpg",
  "https://i.ibb.co/zW6Gb3M5/PXL-20250723-140806628.jpg",
  "https://i.ibb.co/fGKH90ng/PXL-20250723-141344850.jpg",
  "https://i.ibb.co/7N4f680s/PXL-20250723-141349362.jpg",
  "https://i.ibb.co/LX2STvpG/PXL-20250723-141425542.jpg",
  "https://i.ibb.co/r2s2HRQB/PXL-20250723-141440486.jpg",
  "https://i.ibb.co/cXNTjykG/PXL-20250723-141909330.jpg",
  "https://i.ibb.co/8Lq18hkm/PXL-20250723-142058081.jpg",
  "https://i.ibb.co/8L1wy1WZ/PXL-20250723-142452369.jpg",
  "https://i.ibb.co/QFKng25Z/PXL-20250723-143132146.jpg",
  "https://i.ibb.co/pG7WQfH/PXL-20250723-143800407.jpg",
  "https://i.ibb.co/gFXWKDh4/PXL-20250723-143815926.jpg",
  "https://i.ibb.co/5hvKrnVZ/PXL-20250723-144018932.jpg",
  "https://i.ibb.co/whqY8b4w/PXL-20250723-144140458.jpg",
  "https://i.ibb.co/s9bGC7W3/PXL-20250723-144511280.jpg",
  "https://i.ibb.co/n8mbfZzH/PXL-20250723-144556495.jpg",
  "https://i.ibb.co/7t4P7Cb4/PXL-20250723-144717664.jpg",
  "https://i.ibb.co/m543tjqF/PXL-20250723-144800844.jpg",
  "https://i.ibb.co/6cPhs2Cb/PXL-20250723-145242239.jpg",
  "https://i.ibb.co/4gVd0crw/PXL-20250723-145322021.jpg",
  "https://i.ibb.co/35tV3tdC/PXL-20250723-145404122.jpg",
  "https://i.ibb.co/8DL3dvrH/PXL-20250723-145421704.jpg",
  "https://i.ibb.co/G4qhfGV2/PXL-20250723-145427151.jpg",
  "https://i.ibb.co/4RG5BcrW/PXL-20250723-151231813.jpg",
  "https://i.ibb.co/Psz17YXR/PXL-20250723-151537203.jpg",
  "https://i.ibb.co/vvcNq3Pp/PXL-20250723-152236201.jpg",
  "https://i.ibb.co/gXgYXph/PXL-20250723-152449087.jpg",
  "https://i.ibb.co/rK9FxQWN/PXL-20250723-153757750.jpg",
  "https://i.ibb.co/pHqd4sY/PXL-20250723-153859383.jpg",
  "https://i.ibb.co/Kpw8qrQY/PXL-20250723-153957368.jpg",
  "https://i.ibb.co/8n3sCcmk/PXL-20250723-154409310.jpg",
  "https://i.ibb.co/Xk2W3SwY/PXL-20250723-154418699.jpg",
  "https://i.ibb.co/v694NmTr/PXL-20250723-154426154.jpg",
  "https://i.ibb.co/r2jctCDW/PXL-20250723-154431077.jpg",
  "https://i.ibb.co/8gY79CGT/PXL-20250723-154441021.jpg",
  "https://i.ibb.co/hxPp0pLK/PXL-20250723-154446464.jpg",
  "https://i.ibb.co/prkNZKR3/PXL-20250723-154457015.jpg",

  //old
  "https://i.ibb.co/Z6fmsqJs/PXL-20230714-105205426.jpg",
  "https://i.ibb.co/3Y1SqRh6/PXL-20230714-105316943.jpg",
  "https://i.ibb.co/QtHMd6y/PXL-20230714-105345125.jpg",
  "https://i.ibb.co/KxrPPXcK/PXL-20230714-105353611.jpg",
  "https://i.ibb.co/v4MckN20/PXL-20230714-105357620.jpg",
  "https://i.ibb.co/vxnr8YXC/PXL-20230714-105403092.jpg",
  "https://i.ibb.co/dy18jbf/PXL-20230714-105431202.jpg",
  "https://i.ibb.co/My51y3cW/PXL-20230714-113137141.jpg",
  "https://i.ibb.co/F4NP5ypX/PXL-20230714-122351041.jpg",
  "https://i.ibb.co/1JY3hFZR/PXL-20230714-122822904.jpg",
  "https://i.ibb.co/39hYLc9N/PXL-20230714-123442001.jpg",
  "https://i.ibb.co/3mM3ktkN/PXL-20230714-124054523.jpg",
  "https://i.ibb.co/tdhSC1y/PXL-20230714-130128513.jpg",
  "https://i.ibb.co/rGYdpKgn/PXL-20230714-130146954.jpg",
  "https://i.ibb.co/CsWCP8xV/PXL-20230714-131146976.jpg",
  "https://i.ibb.co/zVj0Y4nn/PXL-20230714-131223158.jpg",
  "https://i.ibb.co/7dtdcY0d/PXL-20230714-132829829.jpg",
  "https://i.ibb.co/Q3DrRzv7/PXL-20230714-133050296.jpg",
  "https://i.ibb.co/QSHY19G/PXL-20230714-133930799.jpg",
  "https://i.ibb.co/21zqsktw/PXL-20230714-134451023.jpg",
  "https://i.ibb.co/YFMJQy7Z/PXL-20230714-135216792.jpg",
  "https://i.ibb.co/4R2yVdRh/PXL-20240716-121640178.jpg",
  "https://i.ibb.co/HTMpydT0/PXL-20240716-121916754.jpg",
  "https://i.ibb.co/MkZ0MVxB/PXL-20240716-123036145-1.jpg",
  "https://i.ibb.co/0zKGnbd/PXL-20240716-123451566.jpg",
  "https://i.ibb.co/T98JtKd/PXL-20240716-130851680.jpg",
  "https://i.ibb.co/s93cNRrH/PXL-20240716-130907826.jpg",
  "https://i.ibb.co/6017wvgV/PXL-20240716-130948787.jpg",
  "https://i.ibb.co/KxdZnHFW/PXL-20240716-131032730.jpg",
  "https://i.ibb.co/xK3RyqQR/PXL-20240716-140141239-1.jpg",
  "https://i.ibb.co/0yCCbk0P/PXL-20240716-140337672.jpg",
  "https://i.ibb.co/NXFCg0m/PXL-20240716-140502754-1.jpg",
]
// sports images
const sportsImages = [
  "https://i.ibb.co/Z161Qqqd/PXL-20240221-130500323.jpg",
  "https://i.ibb.co/SXsm83dh/PXL-20240221-130504594.jpg",
  "https://i.ibb.co/x8rvkd00/PXL-20250228-094405004.jpg",
  // Add placeholders to complete the 10 images
  "https://i.ibb.co/fYRB239L/PXL-20250228-094415730.jpg",
  "https://i.ibb.co/TDTQFbMh/PXL-20250319-095023433-PORTRAIT.jpg",
  "https://i.ibb.co/p9vC3Hj/PXL-20250319-095044592-PORTRAIT.jpg",
"https://i.ibb.co/zLXmnn0/PXL-20251112-083334366.jpg" ,
"https://i.ibb.co/NgmvqNRp/PXL-20251112-083242933.jpg",
"https://i.ibb.co/7tjg73rz/PXL-20251112-083014321.jpg",
"https://i.ibb.co/Kp2bkJZp/PXL-20251112-082859905.jpg",
"https://i.ibb.co/XpBGZh7/PXL-20251107-083050575.jpg" ,
"https://i.ibb.co/sJCcT3Nc/PXL-20251107-083048799.jpg",
  "https://i.ibb.co/39vTWmvh/PXL-20250319-110839915.jpg",
  "https://i.ibb.co/7JfYtR6B/PXL-20250319-112554300.jpg",
]
const EOYImages = [
  "https://i.ibb.co/hJ4TRQNj/Gemini-Generated-Image-vq06e9vq06e9vq06.png",
  ]
const CLUB = [
  "https://i.ibb.co/tp7Kz96r/PXL-20251010-130913336.jpg",
  "https://i.ibb.co/CpzGQBYH/PXL-20251017-124935029-NIGHT.jpg",
  "https://i.ibb.co/nNPF8SCJ/PXL-20251017-133456237-NIGHT.jpg",
  "https://i.ibb.co/PvJbrhn6/PXL-20251017-131426130-NIGHT.jpg",
"https://i.ibb.co/M5J72PYK/PXL-20251017-131313140-NIGHT.jpg",
"https://i.ibb.co/dwJN2q7C/PXL-20251017-131016560-NIGHT.jpg",
"https://i.ibb.co/B5mQDHTM/PXL-20251017-130836837-NIGHT.jpg",
"https://i.ibb.co/DPZ943bZ/PXL-20251017-125705345-NIGHT.jpg",
]
const CSLAB = [
  "https://i.ibb.co/mCQk1bG6/PXL-20251016-132855364-NIGHT.jpg",
  "https://i.ibb.co/fV5VqN1S/PXL-20251201-112833838.jpg",
  "https://i.ibb.co/0jqXCwxw/PXL-20251201-112826053.jpg",
  "https://i.ibb.co/YT2mqFY9/PXL-20251201-112352365.jpg",
  "https://i.ibb.co/mZhbwtc/PXL-20251201-111746319.jpg",
  "https://i.ibb.co/wrdCjHRJ/PXL-20251201-111740126.jpg" ,
"https://i.ibb.co/yBSPq7Pt/PXL-20251201-111735461.jpg" ,
"https://i.ibb.co/7NrLjhGK/PXL-20251201-111729374.jpg" ,
"https://i.ibb.co/5xXcHdj6/PXL-20251201-111719644.jpg" ,
"https://i.ibb.co/PRbJszP/PXL-20251201-111710645.jpg" ,
"https://i.ibb.co/20LnYqBd/PXL-20251201-111706955.jpg" ,
"https://i.ibb.co/hF7PhwSs/PXL-20251201-111702471.jpg" ,
"https://i.ibb.co/1fv82Wf7/PXL-20251201-111656547.jpg" ,
"https://i.ibb.co/cKyBsLkV/PXL-20251201-111649801.jpg" ,
"https://i.ibb.co/pvVKXFYm/PXL-20251201-111643908.jpg" ,
"https://i.ibb.co/1fGcJxJ8/PXL-20251201-111638779.jpg" ,
"https://i.ibb.co/vvBbxJ2R/PXL-20251201-111631282.jpg" ,
]

const basic9Images = [
"https://i.ibb.co/C52ZXWHk/PXL-20251201-103027004.jpg",
  "https://i.ibb.co/5hBwY4Tf/photo-2025-12-03-22-33-03.jpg",
  "https://i.ibb.co/KpYWSdpH/PXL-20251201-103041313.jpg",
  "https://i.ibb.co/TMxcBb2X/PXL-20251201-103037493.jpg",
  "https://i.ibb.co/M5D5nJWN/PXL-20251201-103057961.jpg",
]

// Basic 8 images
const basic8Images = [
  "https://i.ibb.co/LDB5J8yX/PXL-20250528-112108716-1.jpg",
    "https://i.ibb.co/Z670tQrR/PXL-20241021-131858996.jpg",
  "https://i.ibb.co/1YjzKMsz/PXL-20241021-131919163.jpg",
       "https://i.ibb.co/203HqdkK/PXL-20250305-090627131.jpg",
  "https://i.ibb.co/SXMtkK5D/PXL-20250321-105741882.jpg",
  "https://i.ibb.co/JR0ctSMB/PXL-20250321-131021778.jpg",
  "https://i.ibb.co/vxKPpx4v/PXL-20250321-131025676.jpg",
  "https://i.ibb.co/QjDCRyhw/PXL-20250326-094408031.jpg",
  "https://i.ibb.co/WNqMDLdZ/PXL-20250326-110252100.jpg",
  
]

// Basic 7 images
const basic7Images = [
  "https://i.ibb.co/wFXvnb2B/PXL-20251201-103053084.jpg",
  "https://i.ibb.co/JWNbQCsX/PXL-20251201-103045004.jpg",
  "https://i.ibb.co/9SYVrfF/PXL-20251201-103020143.jpg",
  "https://i.ibb.co/hxnpLkW7/PXL-20251201-103033171.jpg",
  "https://i.ibb.co/7dqTr2Qm/PXL-20251201-111925450.jpg",
]
// Basic 5 images
const basic5Images = [
  "https://i.ibb.co/1fjX1jKX/PXL-20251201-103314012.jpg",
  "https://i.ibb.co/qSQYj6v/PXL-20251201-103319115.jpg",
  "https://i.ibb.co/nqZp3G4H/PXL-20251201-103327457.jpg",
  "https://i.ibb.co/5gPXXZMx/PXL-20251201-103333012.jpg",
]
// Basic 4 images
const basic4Images = [
  "https://i.ibb.co/vCbRMNhN/PXL-20251201-122934470.jpg" ,
"https://i.ibb.co/0jSKBpBW/PXL-20251201-122930969.jpg" ,
"https://i.ibb.co/Q73M0vZ0/PXL-20251201-122927540.jpg" ,
"https://i.ibb.co/8D5Jp29Y/PXL-20251201-122923135.jpg" ,
"https://i.ibb.co/gBcmzKH/PXL-20251201-122919764.jpg" ,
"https://i.ibb.co/pvyYmHQY/PXL-20251201-122915912.jpg",
"https://i.ibb.co/fWwFLTB/PXL-20251201-122902421.jpg" ,
]
// Basic 3 images
const basic3Images = [
"https://i.ibb.co/Wvk8GyFC/PXL-20251201-123100997.jpg",
"https://i.ibb.co/Hf9JwDQt/PXL-20251201-123057347.jpg" ,
"https://i.ibb.co/dJHHsTPH/PXL-20251201-123050331.jpg" ,
"https://i.ibb.co/S4gPxJnF/PXL-20251201-123044212.jpg" ,
"https://i.ibb.co/BVNjxhJn/PXL-20250327-110230929.jpg",
]
// Basic 2 images
const basic2Images = [
  "https://i.ibb.co/svhkSzKn/PXL-20250305-085419564.jpg",
  "https://i.ibb.co/YF1y4YBx/PXL-20250327-110208664.jpg",
  "https://i.ibb.co/BVNjxhJn/PXL-20250327-110230929.jpg",
  "https://i.ibb.co/YF1y4YBx/PXL-20250327-110208664.jpg",
  "https://i.ibb.co/BVNjxhJn/PXL-20250327-110230929.jpg",
]
// Basic 1 images
const basic1Images = [
    "https://i.ibb.co/0jNsh6Tb/PXL-20250304-121744554.jpg",
  "https://i.ibb.co/qLqFHW5g/PXL-20250304-121749570.jpg",
  "https://i.ibb.co/5XTmjL7z/PXL-20250305-084802173.jpg",
  "https://i.ibb.co/DDmY50Cj/PXL-20250305-084807490.jpg",
]
// Nursery 3 images
const nursery3Images = [
  "https://i.ibb.co/Jw1rYsWq/PXL-20250304-121444473.jpg",
  "https://i.ibb.co/7dctcd9t/PXL-20250304-121448361.jpg",
  "https://i.ibb.co/jZfRVNXN/PXL-20250305-084643013.jpg",
]
// Nursery 2 images
const nursery2Images = [
  "https://i.ibb.co/SXRdg5sk/PXL-20250304-121213028.jpg",
  "https://i.ibb.co/7tXWDGxT/PXL-20250305-084007142.jpg",
]
// Nursery 1 images
const nursery1Images = [
  "https://i.ibb.co/spMk8xsx/PXL-20250214-082847273.jpg",
  "https://i.ibb.co/KcGjSGwF/PXL-20250310-082536354.jpg",
  "https://i.ibb.co/TxJ895bq/PXL-20251201-123400849.jpg",
]
// Pre-Nursery images
const preNurseryImages = [
  "https://i.ibb.co/qM3xcTZr/PXL-20251201-123313920.jpg",
]
// Creche images
const crecheImages = [
    "https://i.ibb.co/vxkd5Wk5/PXL-20250305-091441427.jpg",
  "https://i.ibb.co/chwBs56H/PXL-20250305-091444245.jpg",
]

const classes = [
  {
    level: "Events",
    sections: [
      {
        name: "Colour Day",
        image: "https://i.ibb.co/7d5kgRB0/PXL-20250214-132730029-1-1-1.png",
        customImages: colourdayImages,
      },
      {
        name: "Graduation",
        image: "https://i.ibb.co/pjmbvg7v/PXL-20250214-132912272-1-1-1.png",
        customImages: graduationImages,
      },
      {
        name: "Sports",
        image: "https://i.ibb.co/pjmbvg7v/PXL-20250214-132912272-1-1-1.png",
        customImages: sportsImages,
      },
            {
        name: "End of year Party",
        image: "https://i.ibb.co/pjmbvg7v/PXL-20250214-132912272-1-1-1.png",
        customImages: EOYImages,
      },
    ],
  },
  {
    level: "Secondary School",
    sections: [
                {
        name: "SCIENCE AND ART CLUBS",
        image: "https://i.ibb.co/5hBwY4Tf/photo-2025-12-03-22-33-03.jpg",
        customImages: CLUB,
      },
            {
        name: "COMPUTER LAB",
        image: "https://i.ibb.co/5hBwY4Tf/photo-2025-12-03-22-33-03.jpg",
        customImages: CSLAB,
      },
      {
        name: "BASIC 9",
        image: "https://i.ibb.co/5hBwY4Tf/photo-2025-12-03-22-33-03.jpg",
        customImages: basic9Images,
      },
      {
        name: "BASIC 8",
        image: "https://i.ibb.co/pjmbvg7v/PXL-20250214-132912272-1-1-1.png",
        customImages: basic8Images,
      },
      {
        name: "BASIC 7",
        image: "https://i.ibb.co/7d5kgRB0/PXL-20250214-132730029-1-1-1.png",
        customImages: basic7Images,
      },
    ],
  },
  {
    level: "Primary School",
    sections: [
      { name: "Basic 5", image: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg", customImages: basic5Images },
      { name: "Basic 4", image: "/placeholder.svg?height=300&width=400", customImages: basic4Images },
      { name: "Basic 3", image: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg", customImages: basic3Images },
      { name: "Basic 2", image: "/placeholder.svg?height=300&width=400", customImages: basic2Images },
      { name: "Basic 1", image: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg", customImages: basic1Images },
      { name: "Nursery 3", image: "/placeholder.svg?height=300&width=400", customImages: nursery3Images },
      { name: "Nursery 2", image: "/placeholder.svg?height=300&width=400", customImages: nursery2Images },
      {
        name: "Nursery 1",
        image: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg",
        customImages: nursery1Images,
      },
      {
        name: "Pre-Nursery",
        image: "https://i.ibb.co/pBQ1vm7s/PXL-20250214-082847273-1-1-1.png",
        customImages: preNurseryImages,
      },
      { name: "Creche", image: "https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg", customImages: crecheImages },
    ],
  },
]

// Staff members data - expanded to include 12 more members
const staffMembers = [
  {
    name: "Pastor Philip E.",
    position: "Proprietor",
    image: "https://i.ibb.co/HTPhw0XW/photo-2025-04-19-19-24-12.jpg",
  },
  {
    name: "Mrs. Caroline E.",
    position: "Proprietress",
    image: "https://i.ibb.co/V8MDMBw/photo-2025-04-19-19-54-45.jpg",
  },
  {
    name: "Mr. Emmanuel A.",
    position: "Diction/Phonics/Phonetics Teacher",
    image: "https://i.ibb.co/jdgzbhR/photo-2025-04-19-19-44-33.jpg",
  },
  {
    name: "Mr. Daniel E.",
    position: "Secondary School Teacher",
    image: "https://i.ibb.co/VdWXV1x/photo-2025-04-19-19-03-01.jpg",
  },
  {
    name: "Mrs. Stella-Maris",
    position: "Basic 3 Teacher",
    image: "https://i.ibb.co/Nd4gMyWY/photo-2025-04-19-20-05-19.jpg",
  },
]

export default function OurSchoolPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src="https://i.ibb.co/V0MpQTHv/photo-2025-02-13-08-28-22.jpg"
          alt="Our School"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Our School</h1>
        </div>
      </div>

      {/* Introduction */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-primary">
            We believe that everyone's a student and everyone's a teacher.
          </h2>
          <p className="text-muted-foreground">
            Our Students and staff work together to foster a collaborative learning environment.
          </p>
        </div>
      </section>

      {/* Class Sections */}
      {classes.map((level) => (
        <section key={level.level} className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center text-primary">{level.level}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {level.sections.map((section) => (
                <div key={section.name} className="bg-card rounded-lg shadow-sm overflow-hidden border">
                  {/* Use custom images for Basic 8, Basic 7, and Pre-Nursery, default slider for others */}
                  <ClassImageSlider className={section.name} customImages={section.customImages} />
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-lg text-primary">{section.name}</h3>
                    <p className="text-muted-foreground">{level.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Staff Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center text-primary">Staff and the Board of Trustees</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staffMembers.map((staff, index) => (
              <div key={index} className="bg-card rounded-lg shadow-sm overflow-hidden border">
                <div className="relative aspect-video">
                  <Image src={staff.image || "/placeholder.svg"} alt={staff.name} fill className="object-cover" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg text-primary">{staff.name}</h3>
                  <p className="text-muted-foreground">{staff.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
