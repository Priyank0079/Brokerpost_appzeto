import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import {
  Phone,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  Building,
  ShieldCheck,
  Check,
  Compass,
  Home as HomeIcon,
  MessageCircle,
} from 'lucide-react';
import { getPostingById } from '../services/postingService';

const INTENT_MAP = {
  'PURCHASE': 'Sale',
  'RENT': 'Rent',
  'SALE': 'Sale',
  'RENTALS': 'Rent',
  'LEASE': 'Lease'
};

const SUBTYPE_DISPLAY_MAP = {
  'APARTMENTS': 'Apartments',
  'LOW_RISE_FLOORS': 'Low Rise Floors',
  'KOTHI_VILLAS': 'Kothi / Villas',
  'PLOTS': 'Plots',
  'SHOP_SHOWROOM': 'Shop / Showroom',
  'OFFICE': 'Office',
  'WAREHOUSE': 'Warehouse',
  'STANDALONE_BUILDING': 'Standalone Building',
  'PLOT': 'Plot',
  'COMMERCIAL_APARTMENTS': 'Apartments (Com)'
};

const DISPLAY_OCCUPANCY = {
  'VACANT': 'Vacant',
  'RENTED': 'Rented'
};

const DISPLAY_STATUS = {
  'READY': 'Ready to Move',
  'UNDER_CONSTRUCTION': 'Under Construction'
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const result = await getPostingById(id);
      if (result.success) {
        setItem(result.data);
      }
    } catch (err) {
      console.error('Fetch details error:', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  const handleWhatsAppConnect = () => {
    if (!item) return;
    const message = `Hi, I'm interested in "${item.project || 'Property'}" (ID: #${item._id.slice(-6).toUpperCase()}) located in ${item.location}. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/91${item.postedBy?.phoneNumber || '9876543210'}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };



  if (loading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-slate-400">Syncing Details...</div>;
  if (!item) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-red-400">Post Not Found</div>;

  const displayPrice = item.totalAmount 
    ? `₹${item.totalAmount} ${item.totalAmountUnit}` 
    : (item.budgetMin && item.budgetMax) 
    ? `₹${item.budgetMin}-${item.budgetMax} ${item.budgetUnit}` 
    : item.budgetMax
    ? `₹${item.budgetMax} ${item.budgetUnit}`
    : 'Contact for Price';

  return (
    <div className="min-h-screen bg-white pb-28 lg:pb-12 animate-fade-in overflow-x-hidden">
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-slate-100 px-4 py-2 md:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            className="hover:bg-slate-50 rounded-xl px-3 py-2"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
          >
            <span className="hidden sm:inline">Back to Network</span>
            <span className="sm:hidden text-[10px] font-black uppercase tracking-widest">Back</span>
          </Button>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 flex items-center justify-center border border-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-all">
              <Share2 size={15} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center border border-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-all">
              <Bookmark size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8">
          <div className="lg:col-span-8 space-y-5">
            <section>
              <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2.5">
                <div className="md:col-span-3 md:row-span-2 rounded-2xl overflow-hidden shadow-lg relative group h-[240px] md:h-[360px]">
                  <img
                    src={item.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200"}
                    alt={item.project}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <Badge variant="success" className="bg-emerald-500 text-white shadow-lg px-2.5 py-1 text-[8px] font-black uppercase tracking-widest border-none">
                      {item.postType === 'AVAILABILITY' ? 'Availability' : 'Requirement'}
                    </Badge>
                    <Badge className="bg-white/90 backdrop-blur-md text-slate-900 shadow-lg px-2.5 py-1 text-[8px] font-black uppercase tracking-widest border-none">
                      {item.vertical === 'RESIDENTIAL' ? 'Residential' : 'Commercial'}
                    </Badge>
                  </div>
                </div>
                {item.images?.[1] && (
                  <div className="hidden md:block rounded-[1.5rem] overflow-hidden shadow-md border border-slate-100">
                    <img
                      src={item.images[1]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {item.images?.[2] && (
                  <div className="hidden md:block rounded-[1.5rem] overflow-hidden shadow-md relative border border-slate-100">
                    <img
                      src={item.images[2]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-primary-50 text-primary-600 border-none font-black text-[8px] uppercase tracking-[0.2em] px-2 py-1"
                    >
                      {SUBTYPE_DISPLAY_MAP[item.subType]}
                    </Badge>
                    <span className="text-slate-200">•</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      ID: #{item._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.08]">
                    {item.project || 'Untitled Posting'}
                  </h1>
                  <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-xs md:text-sm">
                    <MapPin size={15} className="text-primary-500 flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-100 flex flex-col items-start md:items-end relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-primary-500/5 rounded-full -mr-10 -mt-10" />
                  <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1 italic">
                    {item.postType === 'AVAILABILITY' ? 'Asking Price' : 'Budget Range'}
                  </p>
                  <p className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">
                    {displayPrice}
                  </p>
                  {item.priceRate && (
                    <p className="text-[10px] font-bold text-primary-600 mt-1">
                      ₹{item.priceRate} / {item.priceRateType === 'PER_SQFT' ? 'sq.ft' : 'unit'}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {item.occupancy && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-50 shadow-soft space-y-2">
                    <Building size={15} className="text-slate-400" />
                    <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Occupancy</p>
                    <p className="font-black text-slate-900 text-sm">{DISPLAY_OCCUPANCY[item.occupancy]}</p>
                  </div>
                )}
                {item.constructionStatus && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-50 shadow-soft space-y-2">
                    <Calendar size={15} className="text-slate-400" />
                    <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Status</p>
                    <p className="font-black text-slate-900 text-sm">{DISPLAY_STATUS[item.constructionStatus]}</p>
                  </div>
                )}
                {item.intent && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-50 shadow-soft space-y-2">
                    <Compass size={15} className="text-slate-400" />
                    <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Intent</p>
                    <p className="font-black text-slate-900 text-sm">{INTENT_MAP[item.intent] || item.intent}</p>
                  </div>
                )}
                {item.subType && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-50 shadow-soft space-y-2">
                    <HomeIcon size={15} className="text-slate-400" />
                    <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-0.5">Category</p>
                    <p className="font-black text-slate-900 text-sm">{SUBTYPE_DISPLAY_MAP[item.subType] || item.subType}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-y border-slate-50">
                {(item.bedrooms || (item.vertical === 'RESIDENTIAL' && item.subType !== 'PLOTS')) && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <Bed size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest italic">
                        {item.bedrooms ? 'Accommodation' : 'Category'}
                      </p>
                      <p className="text-sm font-black text-slate-900">
                        {item.bedrooms ? `${item.bedrooms} BHK` : SUBTYPE_DISPLAY_MAP[item.subType]}
                      </p>
                    </div>
                  </div>
                )}
                
                {item.vertical === 'RESIDENTIAL' && item.subType !== 'PLOTS' && (
                  <div className="flex items-center gap-3 md:border-x md:border-slate-50 md:px-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Bath size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest italic">
                        Washrooms
                      </p>
                      <p className="text-sm font-black text-slate-900">Standard</p>
                    </div>
                  </div>
                )}

                {item.size && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Square size={18} />
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest italic">
                        Area Size
                      </p>
                      <p className="text-sm font-black text-slate-900">{item.size} {item.sizeUnit === 'SQ_FT' ? 'sq.ft' : item.sizeUnit === 'SQ_YD' ? 'sq.yd' : 'sq.mt'}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {item.shortDescription && (
              <section className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight">
                    Narrative Deep-Dive
                  </h3>
                  <div className="h-[2px] flex-1 bg-slate-50" />
                </div>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-medium">
                  {item.shortDescription}
                </p>
              </section>
            )}


          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="lg:sticky lg:top-24 space-y-5 pb-10 lg:pb-0">
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden p-0 ring-1 ring-slate-50">
                <div className="bg-slate-50 p-5 md:p-6 text-center space-y-4 border-b border-white">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-white border-4 border-full shadow-2xl overflow-hidden mx-auto transform -rotate-3 hover:rotate-0 transition-transform">
                      {item.postedBy?.profileImage ? (
                        <img src={item.postedBy.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <img src={`https://ui-avatars.com/api/?name=${item.postedBy?.firstName}+${item.postedBy?.lastName}&background=random`} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center text-white border-4 border-slate-50 shadow-xl">
                      <ShieldCheck size={15} />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 tracking-tight">
                      {item.postedBy 
                        ? (item.postedBy.name || `${item.postedBy.firstName || ''} ${item.postedBy.lastName || ''}`.trim() || 'Listed User')
                        : 'System Agent'}
                    </h4>

                    <p className="text-primary-600 text-[9px] font-black uppercase tracking-[0.3em] mt-0.5">
                      {item.postedBy?.companyName || 'Verified Power Broker'}
                    </p>
                  </div>
                </div>

                <div className="p-5 md:p-6 space-y-5 bg-white">
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={handleWhatsAppConnect}
                      className="w-full py-3.5 border-2 border-emerald-50 text-emerald-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-50 transition-all"
                      leftIcon={<MessageCircle size={16} />}
                    >
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </Card>


            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-100 p-3.5 pb-7 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] flex gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-500">
        <Button
          className="flex-2 w-[65%] py-3.5 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-slate-900/10"
          leftIcon={<Phone size={14} />}
        >
          Call Broker
        </Button>
        <Button
          variant="outline"
          onClick={handleWhatsAppConnect}
          className="flex-1 py-3.5 border-2 border-emerald-500 text-emerald-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-50"
        >
          Chat
        </Button>
      </div>
    </div>
  );
};

export default PropertyDetails;
