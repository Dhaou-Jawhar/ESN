import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {CandidatService} from "../../service/candidat.service";
import {MessageService} from "primeng/api";


interface KPI {
    title: string;
    value: number;
    icon: string;
    color: string;
    trend?: number;
    trendDirection?: 'up' | 'down';
    suffix?: string;
}


@Component({
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

    /*New*/
    statistics = {
        candidates: 1250,
        resources: 450,
        contacts: 780,
        activeClients: 85,
        partnerCompanies: 120,
        totalNeeds: 345
    };

    monthlyNeeds = {
        january: 45,
        february: 52,
        march: 68,
        april: 85,
        may: 95,  // Current month's needs
        cumulative: {
            january: 45,
            february: 97,
            march: 165,
            april: 250,
            may: 345  // Total cumulative needs
        }
    };

    priorityNeeds = [
        { priority: 'Priorité 1', count: 150, percentage: 40 },
        { priority: 'Priorité 2', count: 100, percentage: 27 },
        { priority: 'Priorité 3', count: 80, percentage: 21 },
        { priority: 'Stand By', count: 30, percentage: 8 },
        { priority: 'Fermé', count: 20, percentage: 4 }
    ];


    recentActivities = [
        {
            type: 'new_candidate',
            name: 'Marie Lambert',
            action: 'Nouveau candidat ajouté',
            date: new Date(),
            icon: 'pi pi-user-plus',
            color: 'blue'
        },
        {
            type: 'new_need',
            name: 'Société Tech',
            action: 'Nouveau besoin créé',
            date: new Date(),
            icon: 'pi pi-briefcase',
            color: 'green'
        },
        {
            type: 'new_client',
            name: 'InnovTech Solutions',
            action: 'Nouveau client ajouté',
            date: new Date(),
            icon: 'pi pi-building',
            color: 'purple'
        }
    ];


    // Card Statistics
    totalStats = {
        totalNeeds: 345,
        totalCandidates: 1250,
        vivierCandidates: 450,
        vivierPlusCandidates: 200,
        totalPlacements: 180
    };

    // Candidate Status Distribution
    candidateDistribution = {
        labels: ['Vivier', 'Vivier++', 'En Qualification', 'Autres'],
        datasets: [{
            data: [30, 15, 25, 30],
            backgroundColor: ['#4CAF50', '#2196F3', '#FFA726', '#757575']
        }]
    };

    // Time series data (last 6 months)
    timeSeriesData = {
        labels: ['Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
        totalCandidates: {
            label: 'Total Candidats',
            data: [980, 1050, 1120, 1180, 1220, 1250],
            borderColor: '#4CAF50'
        },
        vivierCandidates: {
            label: 'Candidats Vivier + Vivier++',
            data: [550, 580, 600, 620, 640, 650],
            borderColor: '#2196F3'
        },
        placements: {
            label: 'Positionnements',
            data: [120, 135, 148, 160, 172, 180],
            borderColor: '#FFA726'
        },
        totalNeeds: {
            label: 'Besoins Totaux',
            data: [250, 280, 300, 320, 335, 345],
            borderColor: '#9C27B0'
        },
        newNeeds: {
            label: 'Nouveaux Besoins',
            data: [15, 18, 20, 22, 25, 28],
            borderColor: '#E91E63'
        }
    };

    needsByPriority = {
        labels: ['Déc', 'Jan', 'Fév', 'Mar', 'Avr', 'Mai'],
        datasets: [
            {
                label: 'Priorité 1',
                data: [60, 62, 65, 68, 70, 72],
                borderColor: '#4A148C', // Violet foncé
                backgroundColor: '#4A148C'
            },
            {
                label: 'Priorité 2',
                data: [50, 52, 54, 56, 58, 60],
                borderColor: '#7B1FA2', // Violet moyen
                backgroundColor: '#7B1FA2'
            },
            {
                label: 'Priorité 3',
                data: [40, 42, 44, 46, 48, 50],
                borderColor: '#BA68C8', // Violet clair
                backgroundColor: '#BA68C8'
            },
            {
                label: 'Stand By',
                data: [20, 22, 24, 26, 28, 30],
                borderColor: '#FFA726', // Orange
                backgroundColor: '#FFA726'
            },
            {
                label: 'Fermé',
                data: [10, 12, 14, 16, 18, 20],
                borderColor: '#f44336', // Rouge
                backgroundColor: '#f44336'
            }
        ]
    };



    // Chart Options
    lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        },
        elements: {
            line: {
                tension: 0.4
            },
            point: {
                radius: 4
            }
        }
    };

    pieChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };


    items!: MenuItem[];

    products!: Product[];

    chartData: any;

    chartOptions: any;

    subscription!: Subscription;

    loading: boolean = true;

    candidates: any[] = []; // Contiendra les candidats réels
    candidates1: any[]; // Contiendra la réponse brute de l'API

    constructor(private productService: ProductService, public layoutService: LayoutService, private candidatService: CandidatService,private messageService: MessageService) {
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
            this.initChart();
        });

        // Chart data showing both monthly needs and cumulative total
        this.chartData = {
            labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai'],
            datasets: [
                {
                    label: 'Besoins mensuels',
                    data: [
                        this.monthlyNeeds.january,
                        this.monthlyNeeds.february,
                        this.monthlyNeeds.march,
                        this.monthlyNeeds.april,
                        this.monthlyNeeds.may
                    ],
                    fill: false,
                    borderColor: '#4CAF50',
                    tension: 0.4,
                    type: 'bar'
                },
                {
                    label: 'Total cumulé',
                    data: [
                        this.monthlyNeeds.cumulative.january,
                        this.monthlyNeeds.cumulative.february,
                        this.monthlyNeeds.cumulative.march,
                        this.monthlyNeeds.cumulative.april,
                        this.monthlyNeeds.cumulative.may
                    ],
                    fill: false,
                    borderColor: '#2196F3',
                    tension: 0.4,
                    type: 'line'
                }
            ]
        };

        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    },
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Évolution des besoins en 2024',
                    color: '#495057',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
    }

    ngOnInit() {
        this.initChart();
        this.productService.getProductsSmall().then(data => this.products = data);
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

        this.chartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'First Dataset',
                    data: [65, 59, 80, 81, 56, 55, 40],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--bluegray-700'),
                    borderColor: documentStyle.getPropertyValue('--bluegray-700'),
                    tension: .4
                },
                {
                    label: 'Second Dataset',
                    data: [28, 48, 40, 19, 86, 27, 90],
                    fill: false,
                    backgroundColor: documentStyle.getPropertyValue('--green-600'),
                    borderColor: documentStyle.getPropertyValue('--green-600'),
                    tension: .4
                }
            ]
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    // Calculate week-over-week change
    getWeeklyChange(current: number, previous: number): number {
        return ((current - previous) / previous) * 100;
    }
}
