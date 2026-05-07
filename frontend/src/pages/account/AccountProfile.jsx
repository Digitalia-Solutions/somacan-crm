import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckCircle2, Crosshair, MapPin, Navigation, User2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AddressLocationPicker from '../../components/account/AddressLocationPicker';

export default function AccountProfile() {
  const { user } = useOutletContext();
  const { updateProfile } = useAuth();
  const [profileState, setProfileState] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine1: user?.addressLine1 || '',
    addressLine2: user?.addressLine2 || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    country: user?.country || 'Maroc',
    latitude: user?.latitude || '',
    longitude: user?.longitude || '',
    locationLabel: user?.locationLabel || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [geocodeLoading, setGeocodeLoading] = useState(false);

  useEffect(() => {
    setProfileState({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      addressLine1: user?.addressLine1 || '',
      addressLine2: user?.addressLine2 || '',
      city: user?.city || '',
      postalCode: user?.postalCode || '',
      country: user?.country || 'Maroc',
      latitude: user?.latitude || '',
      longitude: user?.longitude || '',
      locationLabel: user?.locationLabel || '',
    });
  }, [user]);

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfileState((current) => ({ ...current, [name]: value }));
  }

  async function reverseGeocode(latitude, longitude) {
    setGeocodeLoading(true);
    setLocationError('');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=fr`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();
      const address = data.address || {};
      const line1 = [
        address.house_number,
        address.road || address.pedestrian || address.footway,
      ]
        .filter(Boolean)
        .join(' ')
        || address.neighbourhood
        || address.suburb
        || '';

      setProfileState((current) => ({
        ...current,
        addressLine1: line1 || current.addressLine1,
        addressLine2: address.suburb || address.neighbourhood || current.addressLine2,
        city: address.city || address.town || address.village || address.state_district || current.city,
        postalCode: address.postcode || current.postalCode,
        country: address.country || current.country || 'Maroc',
        locationLabel: data.display_name || current.locationLabel,
      }));
    } catch {
      setLocationError('Position detectee, mais impossible de remplir automatiquement l adresse exacte.');
    } finally {
      setGeocodeLoading(false);
    }
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setProfileSaving(true);
    setProfileMessage('');
    setProfileError('');

    try {
      await updateProfile(profileState);
      setProfileMessage('Profil mis a jour avec succes.');
    } catch (error) {
      setProfileError(error.message || 'Impossible de mettre a jour votre profil.');
    } finally {
      setProfileSaving(false);
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setLocationError('La geolocalisation n est pas disponible sur cet appareil.');
      return;
    }

    setLocationLoading(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const nextLatitude = position.coords.latitude.toFixed(7);
        const nextLongitude = position.coords.longitude.toFixed(7);

        setProfileState((current) => ({
          ...current,
          latitude: nextLatitude,
          longitude: nextLongitude,
          locationLabel: 'Position GPS actuelle',
          country: current.country || 'Maroc',
        }));
        await reverseGeocode(nextLatitude, nextLongitude);
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
        setLocationError('Impossible de recuperer votre position actuelle.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  }

  function useAddressForMap() {
    const label = [
      profileState.addressLine1,
      profileState.city,
      profileState.postalCode,
      profileState.country,
    ]
      .filter(Boolean)
      .join(', ');

    setProfileState((current) => ({
      ...current,
      locationLabel: label || current.locationLabel || 'Adresse renseignee manuellement',
    }));
  }

  async function handleMapLocationChange(latlng) {
    const nextLatitude = latlng.lat.toFixed(7);
    const nextLongitude = latlng.lng.toFixed(7);

    setProfileState((current) => ({
      ...current,
      latitude: nextLatitude,
      longitude: nextLongitude,
    }));

    await reverseGeocode(nextLatitude, nextLongitude);
  }

  return (
    <section className="rounded-[2rem] border border-stone-200/70 bg-white p-6 shadow-[0_18px_50px_rgba(28,25,23,0.04)]">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#043920] text-white shadow-[0_12px_28px_rgba(4,57,32,0.18)]">
          <User2 size={18} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-stone-400">Informations personnelles</p>
          <h2 className="mt-2 font-display text-3xl text-somacan-brand">Mon profil</h2>
        </div>
      </div>

      <form onSubmit={handleProfileSubmit} className="mt-8 grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Prenom</span>
            <input
              name="firstName"
              value={profileState.firstName}
              onChange={handleProfileChange}
              className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Nom</span>
            <input
              name="lastName"
              value={profileState.lastName}
              onChange={handleProfileChange}
              className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Email</span>
            <input
              name="email"
              type="email"
              value={profileState.email}
              onChange={handleProfileChange}
              className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Telephone</span>
            <input
              name="phone"
              value={profileState.phone}
              onChange={handleProfileChange}
              className="h-14 rounded-2xl border border-stone-200 bg-[#fcfaf7] px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920] focus:bg-white"
            />
          </label>
        </div>

        <div className="mt-2 rounded-[1.8rem] border border-stone-200 bg-[#fcfaf7] p-5">
          <div className="flex items-center gap-3">
            <MapPin className="text-[#043920]" size={18} />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Adresse client</p>
              <p className="mt-1 text-sm text-stone-500">Le client peut saisir son adresse, utiliser le GPS actuel ou enregistrer des coordonnees vues sur la carte.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 md:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Adresse ligne 1</span>
                <input
                  name="addressLine1"
                  value={profileState.addressLine1}
                  onChange={handleProfileChange}
                  placeholder="Quartier, avenue, numero..."
                  className="h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920]"
                />
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Adresse ligne 2</span>
                <input
                  name="addressLine2"
                  value={profileState.addressLine2}
                  onChange={handleProfileChange}
                  placeholder="Immeuble, etage, point de repere..."
                  className="h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920]"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Ville</span>
                <input
                  name="city"
                  value={profileState.city}
                  onChange={handleProfileChange}
                  placeholder="Casablanca"
                  className="h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920]"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Code postal</span>
                <input
                  name="postalCode"
                  value={profileState.postalCode}
                  onChange={handleProfileChange}
                  placeholder="20000"
                  className="h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920]"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Pays</span>
                <input
                  name="country"
                  value={profileState.country}
                  onChange={handleProfileChange}
                  className="h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920]"
                />
              </label>
            </div>

            <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-5">
                <div className="rounded-[1.5rem] bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Position actuelle</p>
                  <p className="mt-2 text-sm leading-7 text-stone-500">Utilisez le GPS du navigateur pour remplir rapidement la localisation du client.</p>
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    disabled={locationLoading || geocodeLoading}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Navigation size={14} />
                    {locationLoading || geocodeLoading ? 'Detection...' : 'Utiliser ma position actuelle'}
                  </button>
                </div>

                <div className="rounded-[1.5rem] bg-white p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Choix sur carte</p>
                  <p className="mt-2 text-sm leading-7 text-stone-500">
                    Renseignez l adresse ou les coordonnees GPS, puis validez la vue carte pour enregistrer le bon point de livraison.
                  </p>
                  <button
                    type="button"
                    onClick={useAddressForMap}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-stone-700 transition-colors hover:border-stone-900 hover:text-stone-900"
                  >
                    <Crosshair size={14} />
                    Utiliser cette adresse sur la carte
                  </button>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Latitude</span>
                    <input
                      name="latitude"
                      value={profileState.latitude}
                      onChange={handleProfileChange}
                      placeholder="33.5731104"
                      className="h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920]"
                    />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Longitude</span>
                    <input
                      name="longitude"
                      value={profileState.longitude}
                      onChange={handleProfileChange}
                      placeholder="-7.5898434"
                      className="h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920]"
                    />
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-stone-400">Libelle de localisation</span>
                  <input
                    name="locationLabel"
                    value={profileState.locationLabel}
                    onChange={handleProfileChange}
                    placeholder="Maison, bureau, point de repere..."
                    className="h-14 rounded-2xl border border-stone-200 bg-white px-5 text-sm text-stone-900 outline-none transition-colors focus:border-[#043920]"
                  />
                </label>
              </div>

              <AddressLocationPicker
                latitude={profileState.latitude}
                longitude={profileState.longitude}
                onLocationChange={handleMapLocationChange}
              />
            </div>

            {locationError && (
              <div className="rounded-[1.4rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {locationError}
              </div>
            )}

            {geocodeLoading && (
              <div className="rounded-[1.4rem] border border-stone-200 bg-white px-5 py-4 text-sm text-stone-600">
                Recuperation de l adresse a partir du point choisi...
              </div>
            )}
          </div>
        </div>

        {profileMessage && (
          <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} />
              {profileMessage}
            </div>
          </div>
        )}

        {profileError && (
          <div className="rounded-[1.4rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {profileError}
          </div>
        )}

        <button type="submit" disabled={profileSaving} className="btn-luxury btn-luxury-primary justify-center sm:w-fit">
          {profileSaving ? 'Mise a jour...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </section>
  );
}
