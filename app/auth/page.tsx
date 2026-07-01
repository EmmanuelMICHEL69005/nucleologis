'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [role, setRole] = useState<'travailleur' | 'proprietaire'>('travailleur')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    await new Promise(r => setTimeout(r, 800))
    setMessage(mode === 'login'
      ? '✓ Connectez Supabase (.env.local) pour activer l\'authentification.'
      : '✓ Compte créé ! Connectez Supabase (.env.local) pour enregistrer les utilisateurs.')
    setLoading(false)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5fa0] px-8 py-8 text-center text-white">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">☢</div>
            <h1 className="text-xl font-bold">NucléoLogis</h1>
            <p className="text-blue-200 text-sm mt-1">
              {mode === 'login' ? 'Connectez-vous à votre compte' : 'Créez votre compte gratuitement'}
            </p>
          </div>

          <div className="px-8 py-6">
            {/* Mode toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === 'login' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
              >
                Connexion
              </button>
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === 'register' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'}`}
              >
                Inscription
              </button>
            </div>

            {/* Role selector (register only) */}
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => setRole('travailleur')}
                  className={`p-3 rounded-xl border-2 text-center transition ${role === 'travailleur' ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="text-xl mb-1">🔧</div>
                  <div className="text-xs font-semibold text-gray-700">Je cherche</div>
                  <div className="text-xs text-gray-400">un logement</div>
                </button>
                <button
                  onClick={() => setRole('proprietaire')}
                  className={`p-3 rounded-xl border-2 text-center transition ${role === 'proprietaire' ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="text-xl mb-1">🏡</div>
                  <div className="text-xs font-semibold text-gray-700">Je propose</div>
                  <div className="text-xs text-gray-400">mon logement</div>
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Nom complet</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Jean-Pierre Martin"
                    required={mode === 'register'}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vous@exemple.fr"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Mot de passe
                  {mode === 'login' && (
                    <button type="button" className="ml-auto float-right text-orange-500 hover:underline font-normal">
                      Oublié ?
                    </button>
                  )}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Minimum 8 caractères' : '••••••••'}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {message && (
                <div className="text-xs bg-orange-50 text-orange-700 rounded-lg p-3 border border-orange-100">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold text-sm transition disabled:opacity-60"
              >
                {loading ? '...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-100"/>
              <span className="text-xs text-gray-400">ou continuer avec</span>
              <div className="flex-1 h-px bg-gray-100"/>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition">
                <span>🔵</span> Google
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition">
                <span>🔷</span> LinkedIn
              </button>
            </div>

            <p className="text-center text-xs text-gray-400 mt-6">
              {mode === 'login' ? (
                <>Pas encore de compte ?{' '}
                  <button onClick={() => setMode('register')} className="text-orange-500 hover:underline">S'inscrire</button>
                </>
              ) : (
                <>Déjà un compte ?{' '}
                  <button onClick={() => setMode('login')} className="text-orange-500 hover:underline">Se connecter</button>
                </>
              )}
            </p>

            {mode === 'register' && (
              <p className="text-center text-xs text-gray-300 mt-2">
                En créant un compte, vous acceptez nos{' '}
                <Link href="#" className="text-gray-400 hover:underline">CGU</Link>
                {' '}et notre{' '}
                <Link href="#" className="text-gray-400 hover:underline">politique de confidentialité</Link>.
              </p>
            )}
          </div>
        </div>

        {/* Dev note */}
        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4 text-xs text-amber-700">
          <strong>Configuration requise :</strong> Ajoutez vos clés Supabase dans <code className="bg-amber-100 px-1 rounded">.env.local</code> pour activer l'authentification réelle.
        </div>
      </div>
    </div>
  )
}
