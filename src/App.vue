<template>
  <v-data-table v-model="selected" :headers="headers" :search="search" :custom-filter="customFilter" :items="items" item-key="name" show-select>
    <template v-slot:top>
      <v-container>
        <v-row>
          <v-col>
            <h2>Занимаемые должности</h2>
          </v-col>
          <v-col>
            <v-container>
              <v-row>
                <v-col>
                  <v-text-field v-model="search" append-icon="search" label="Поиск по сотруднику" single-line hide-details/>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-checkbox v-model="showFired" label="Показать уволенных" color="#388e3c"/>
                </v-col>
                <v-col>
                  <v-btn color="#a5d6a7" width="75%">Принять на должность</v-btn>
                </v-col>
                <v-col>
                  <v-btn :disabled="selected.length === 0" color="#ff8b81" width="75%">Снять с {{selected.length > 1 ? 'должностей' : 'должности'}}</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </template>
    <template v-slot:header.data-table-select>
      <v-simple-checkbox :value="allSelected" :indeterminate="partSelected" @input="selectAll"/>
    </template>
    <template v-slot:item="{ index, item, isSelected, select}">
      <tr v-bind:style="{ backgroundColor: item.fireDate !== null ? '#ff8b81' : 'white' }">
        <td>
          <v-simple-checkbox v-if="item.fireDate === null" :value="isSelected" @input="select($event)"/>
        </td>
        <td>{{ item.name }}</td>
        <td>{{ item.companyName }}</td>
        <td>{{ item.positionName }}</td>
        <td>{{ item.hireDate }}</td>
        <td>{{ item.fireDate }}</td>
        <td>
          <v-menu v-if="item.fireDate === null" :value ="salaryEditIndex === index" top right :close-on-content-click="false" class="v-small-dialog">
            <template v-slot:activator="{ on }">
              <div class="v-small-dialog__activator">
                <span class="v-small-dialog__activator__content" @click="editItem(item)">{{ item.salary }}₽ ({{ item.fraction }}%)</span>
              </div>
            </template>
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>Ставка, руб</v-col>
                    <v-col>Ставка, %</v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field v-model="salaryEditData.salary" type="number" color="#a5d6a7" label="Введите число" single-line counter/>
                    </v-col>
                    <v-col>
                      <v-text-field v-model="salaryEditData.fraction" type="number " color="#a5d6a7" label="Введите число" single-line counter/>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="close">Отмена</v-btn>
                <v-btn @click="save">Сохранить</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
          <span v-if="item.fireDate !== null">{{ item.salary }}₽ ({{ item.fraction }}%)</span>
        </td>
        <td>
          <v-edit-dialog v-if="item.fireDate === null" large cancel-text="Отмена" save-text="Сохранить" :return-value.sync="item.base">
            {{ item.base }}
            <template v-slot:input>
              <v-text-field v-model="item.base" type="number" label="Введите число" single-line counter/>
            </template>
          </v-edit-dialog>
          <span v-if="item.fireDate !== null">{{ item.base }}</span>
        </td>
        <td>
          <v-edit-dialog v-if="item.fireDate === null" large cancel-text="Отмена" save-text="Сохранить" :return-value.sync="item.advance">
            {{ item.advance }}
            <template v-slot:input>
              <v-text-field v-model="item.advance" type="number" label="Введите число" single-line counter/>
            </template>
          </v-edit-dialog>
          <span v-if="item.fireDate !== null">{{ item.advance }}</span>
        </td>
        <td>
          <v-checkbox v-model="item.byHours" :disabled="item.fireDate !== null" color="#388e3c"/>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    data() {
      return {
        search: '',
        showFired: true,
        salaryEditData: {},
        salaryEditIndex: -1,
        selected: [],
        headers: [{
            text: 'Сотрудник',
			value: 'name',
          },
          {
            text: 'Компания',
            value: 'companyName'
          },
          {
            text: 'Должность',
            value: 'positionName'
          },
          {
            text: 'Дата приёма',
            value: 'hireDate'
          },
          {
            text: 'Дата уольнения',
            value: 'fireDate',
            filter: value => {
              if (value === null) return true
              return this.showFired
            },
          },
          {
            text: 'Ставка',
            value: 'salary'
          },
          {
            text: 'База',
            value: 'base'
          },
          {
            text: 'Аванс',
            value: 'advance'
          },
          {
            text: 'Почасовая',
            value: 'byHours'
          },
        ],
        items: [{
            name: 'Джордж Вашингтон',
            companyName: 'ООО "Синергия"',
            positionName: 'Первый президент США',
            hireDate: '1789-04-30',
            fireDate: '1797-03-04',
            salary: 1000,
            fraction: 100,
            base: 1000,
            advance: 1000,
            byHours: false
          },
          {
            name: 'Ричард I Львиное Сердце',
            companyName: 'ООО "Синергия"',
            positionName: 'Король Англии',
            hireDate: '1189-01-01',
            fireDate: '1199-05-17',
            salary: 1000,
            fraction: 100,
            base: 1000,
            advance: 1000,
            byHours: true
          },
          {
            name: 'Джейсон Стейтем',
            companyName: 'ООО "Синергия"',
            positionName: 'Бейкон',
            hireDate: '1998-09-01',
            fireDate: null,
            salary: 1000,
            fraction: 100,
            base: 1000,
            advance: 1000,
            byHours: false
          },
          {
            name: 'Тарантино К. Дж.',
            companyName: 'ООО "Синергия"',
            positionName: 'Джимми',
            hireDate: '1994-04-15',
            fireDate: null,
            salary: 1000,
            fraction: 100,
            base: 3000,
            advance: 1000,
            byHours: false
          },
          {
            name: 'Камбербэтч Б.',
            companyName: 'ООО "Синергия"',
            positionName: 'Смауг',
            hireDate: '1000-01-01',
            fireDate: '2941-10-09',
            salary: 1000,
            fraction: 50,
            base: 2000,
            advance: 1000,
            byHours: false
          },
          {
            name: 'Крузенштерн И. Ф.',
            companyName: 'ООО "Синергия"',
            positionName: 'Человек и пароход',
            hireDate: '1770-11-08',
            fireDate: null,
            salary: 1000,
            fraction: 100,
            base: 1000,
            advance: 1000,
            byHours: false
          },
          {
            name: 'Бендер С. Р.',
            companyName: '"Planet Express"',
            positionName: 'Робот-сгибальщик',
            hireDate: '2997-03-27',
            fireDate: null,
            salary: 1000,
            fraction: 100,
            base: 1000,
            advance: 1000,
            byHours: true
          }
        ],
      }
    },
    methods: {
      customFilter(value, search, item) {
        return search != null &&
          item.name.indexOf(search) !== -1
      },
      selectAll() {
        let maxCount = this.items.filter(x => x.fireDate == null).length
        if (this.selected.length === maxCount) {
          this.selected = []
        } else {
          this.selected = []
          for (let i in this.items) {
            if (this.items[i].fireDate == null) {
              this.selected.push(this.items[i])
            }
          }
        }
      },
      editItem(item) {
        this.salaryEditData = Object.assign({}, item)
        this.salaryEditIndex = this.items.indexOf(item)
      },
      close() {
        this.salaryEditIndex = -1
        this.salaryEditData = {}
      },
      save() {
        if (this.salaryEditIndex > -1) {
          Object.assign(this.items[this.salaryEditIndex], this.salaryEditData)
        }
        this.close()
      },
    },
    computed: {
      allSelected: function() {
        let maxCount = this.items.filter(x => x.fireDate == null).length
        return this.selected.length === maxCount
      },
      partSelected: function() {
        let maxCount = this.items.filter(x => x.fireDate == null).length
        return this.selected.length > 0 && this.selected.length !== maxCount
      }
    }
  }
</script>
