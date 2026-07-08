"use client"

import { useMemo, useState } from "react"
import AssociationsMultiSelect from "@/components/AssociationsMultiSelect"
import PillBadge from "@/components/PillBadge"
import SurfacePanel from "@/components/SurfacePanel"
import type { DepartmentScope } from "@/types/territory"
import type { Department, Region, Tag } from "@/types/association"

const MAX_DESCRIPTION_LENGTH = 2000

type Props = {
  associationId: string
  description: string
  tags: Tag[]
  departments: Department[]
  regions: Region[]
  selectedTagCodes: string[]
  selectedDepartmentCodes: string[]
  initialScope: DepartmentScope
  descriptionUpdated: boolean
  descriptionError: string | null
  tagsUpdated: boolean
  territoriesUpdated: boolean
  tagsError: string | null
  territoriesError: string | null
  descriptionAction: (formData: FormData) => void | Promise<void>
  tagsAction: (formData: FormData) => void | Promise<void>
  territoriesAction: (formData: FormData) => void | Promise<void>
}

function unique(values: string[]) {
  return Array.from(new Set(values))
}

function counterToneClass(length: number) {
  if (length >= 1950) return "text-rose-300"
  if (length >= 1800) return "text-amber-200"
  return "text-white/55"
}

export default function AssociationSettingsEditor({
  associationId,
  description,
  tags,
  departments,
  regions,
  selectedTagCodes,
  selectedDepartmentCodes,
  initialScope,
  descriptionUpdated,
  descriptionError,
  tagsUpdated,
  territoriesUpdated,
  tagsError,
  territoriesError,
  descriptionAction,
  tagsAction,
  territoriesAction,
}: Props) {
  const [scope, setScope] = useState<DepartmentScope>(initialScope)
  const [descriptionLength, setDescriptionLength] = useState(description.length)
  const [tagsSelection, setTagsSelection] = useState<string[]>(selectedTagCodes)
  const [departmentSelection, setDepartmentSelection] = useState<string[]>(selectedDepartmentCodes)

  const initialRegionCodes = useMemo(
    () =>
      unique(
        departments
          .filter((department) => selectedDepartmentCodes.includes(department.code))
          .map((department) => department.region?.code)
          .filter((code): code is string => Boolean(code))
      ),
    [departments, selectedDepartmentCodes]
  )

  const [regionSelection, setRegionSelection] = useState<string[]>(initialRegionCodes)

  const savedTags = useMemo(
    () => tags.filter((tag) => selectedTagCodes.includes(tag.code)),
    [tags, selectedTagCodes]
  )

  const savedDepartments = useMemo(
    () => departments.filter((department) => selectedDepartmentCodes.includes(department.code)),
    [departments, selectedDepartmentCodes]
  )

  return (
    <div className="space-y-4">
      <SurfacePanel className="rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white">Description</h2>
        <p className="mt-2 text-sm text-white/70">Mettez à jour la description publique de votre association.</p>

        <div className="mt-3">
          {descriptionUpdated ? (
            <p className="rounded-xl border border-emerald-300/35 bg-emerald-400/12 px-3 py-2 text-sm text-emerald-100">
              Description mise à jour.
            </p>
          ) : null}
          {descriptionError ? <p className="ui-error px-3 py-2 text-sm">{descriptionError}</p> : null}
        </div>

        <form action={descriptionAction} className="mt-4 space-y-4">
          <input type="hidden" name="associationId" value={associationId} />
          <textarea
            name="description"
            defaultValue={description}
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows={6}
            placeholder="Présentez votre association en quelques lignes."
            className="ui-input min-h-34 resize-y"
            onChange={(event) => setDescriptionLength(event.target.value.length)}
          />

          <p className={`text-right text-xs ${counterToneClass(descriptionLength)}`} aria-live="polite">
            {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
          </p>

          <button type="submit" className="ui-button rounded-xl px-4 py-2 text-sm">
            Enregistrer la description
          </button>
        </form>
      </SurfacePanel>

      <SurfacePanel className="rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white">Tags</h2>
        <p className="mt-2 text-sm text-white/70">Mettez à jour les tags de votre association.</p>

        <div className="mt-3">
          {tagsUpdated ? (
            <p className="rounded-xl border border-emerald-300/35 bg-emerald-400/12 px-3 py-2 text-sm text-emerald-100">
              Tags mis à jour.
            </p>
          ) : null}
          {tagsError ? <p className="ui-error px-3 py-2 text-sm">{tagsError}</p> : null}
        </div>

        <form action={tagsAction} className="mt-4 space-y-4">
          <input type="hidden" name="associationId" value={associationId} />

          <AssociationsMultiSelect
            title="Tags"
            name="tags"
            options={tags.map((tag) => ({
              value: tag.code,
              label: tag.label,
              meta: tag.code,
            }))}
            selectedValues={tagsSelection}
            searchPlaceholder="Filtrer les tags"
            emptyLabel="Aucun tag ne correspond à cette recherche."
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTagsSelection([])}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
            >
              Tout désélectionner
            </button>
            <button type="submit" className="ui-button rounded-xl px-4 py-2 text-sm">
              Enregistrer les tags
            </button>
          </div>
        </form>

        <div className="mt-5 border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-white">Tags sauvegardés</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {savedTags.length ? (
              savedTags.map((tag) => (
                <PillBadge key={tag.id} tone="accent">
                  {tag.label}
                </PillBadge>
              ))
            ) : (
              <p className="text-sm text-white/65">Aucun tag sauvegardé.</p>
            )}
          </div>
        </div>
      </SurfacePanel>

      <SurfacePanel className="rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white">Périmètre territorial</h2>
        <p className="mt-2 text-sm text-white/70">
          Choisissez un niveau de couverture puis renseignez les valeurs associées.
        </p>

        <div className="mt-3">
          {territoriesUpdated ? (
            <p className="rounded-xl border border-emerald-300/35 bg-emerald-400/12 px-3 py-2 text-sm text-emerald-100">
              Périmètre territorial mis à jour.
            </p>
          ) : null}
          {territoriesError ? (
            <p className="ui-error px-3 py-2 text-sm">{territoriesError}</p>
          ) : null}
        </div>

        <form action={territoriesAction} className="mt-4 space-y-4">
          <input type="hidden" name="associationId" value={associationId} />
          <input type="hidden" name="scope" value={scope} />

          <div className="rounded-2xl border border-white/10 bg-[rgba(24,28,36,0.84)] p-4">
            <div className="mt-1 flex flex-wrap gap-2">
              {([
                ["DEPARTMENTS", "Départements"],
                ["REGIONS", "Régions"],
                ["NATIONAL", "National"],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setScope(value)}
                  className={
                    "rounded-full border px-3 py-1.5 text-sm transition " +
                    (scope === value
                      ? "border-white/30 bg-white/12 text-white"
                      : "border-white/15 bg-white/4 text-white/70 hover:bg-white/8")
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {scope === "DEPARTMENTS" ? (
            <AssociationsMultiSelect
              title="Départements"
              name="departmentCodes"
              options={departments.map((department) => ({
                value: department.code,
                label: department.name,
                meta: department.region?.name
                  ? `${department.code} · ${department.region.name}`
                  : department.code,
              }))}
              selectedValues={departmentSelection}
              searchPlaceholder="Filtrer les départements"
              emptyLabel="Aucun département ne correspond à cette recherche."
            />
          ) : null}

          {scope === "REGIONS" ? (
            <AssociationsMultiSelect
              title="Régions"
              name="regionCodes"
              options={regions.map((region) => ({
                value: region.code,
                label: region.name,
                meta: region.code,
              }))}
              selectedValues={regionSelection}
              searchPlaceholder="Filtrer les régions"
              emptyLabel="Aucune région ne correspond à cette recherche."
            />
          ) : null}

          {scope === "NATIONAL" ? (
            <p className="rounded-xl border border-white/12 bg-white/4 px-3 py-3 text-sm text-white/75">
              Le scope national ne requiert aucune sélection de département ou de région.
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (scope === "DEPARTMENTS") {
                  setDepartmentSelection([])
                  return
                }

                if (scope === "REGIONS") {
                  setRegionSelection([])
                }
              }}
              className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
            >
              Tout désélectionner
            </button>
            <button type="submit" className="ui-button rounded-xl px-4 py-2 text-sm">
              Enregistrer le périmètre
            </button>
          </div>
        </form>

        <div className="mt-5 border-t border-white/10 pt-4">
          <h3 className="text-sm font-semibold text-white">Départements sauvegardés</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {savedDepartments.length ? (
              savedDepartments.map((department) => (
                <PillBadge key={department.code}>
                  {department.name} ({department.code})
                </PillBadge>
              ))
            ) : (
              <p className="text-sm text-white/65">Aucun département sauvegardé.</p>
            )}
          </div>
        </div>
      </SurfacePanel>
    </div>
  )
}
